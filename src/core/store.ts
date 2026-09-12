import {
  EnvVariable,
  EnvChangeListener,
  StoreChangeListener,
  LambaOptions,
  PresetProfile,
} from './types';
import { PresetManager } from './preset-manager';
import { autoDiscoverBrowserEnv, tryFetchRootEnvFile } from './env-parser';
import { LambaStorageAdapter, createStorageAdapter } from './storage';

const STORAGE_OVERRIDES_KEY = '__lamba_overrides__';
const DEFAULT_SECRET_PATTERN = /(KEY|SECRET|TOKEN|PASSWORD|AUTH|PRIVATE|CREDENTIAL|SIGNATURE)/i;

export class EnvStore {
  private variables: Map<string, EnvVariable> = new Map();
  private overrides: Record<string, any> = {};
  private secretPattern: RegExp;
  private allowedPrefixes?: string | string[] | RegExp | null;
  private envChangeListeners: Set<EnvChangeListener> = new Set();
  private storeChangeListeners: Set<StoreChangeListener> = new Set();
  private storage: LambaStorageAdapter;
  public presetManager: PresetManager;

  constructor(options: LambaOptions = {}) {
    this.secretPattern = options.secretKeysPattern || DEFAULT_SECRET_PATTERN;
    this.allowedPrefixes = options.allowedPrefixes;
    this.storage = createStorageAdapter(options.storageStrategy ?? 'local', options.storage);
    this.presetManager = new PresetManager(this.storage);

    // 1. Load initial overrides from localStorage
    this.loadOverridesFromStorage();

    // 2. Register initial options.env if provided
    if (options.env) {
      this.mergeDefaults(options.env);
    }

    // 3. Auto-discover from browser runtime
    const autoDiscovered = autoDiscoverBrowserEnv();
    this.mergeDefaults(autoDiscovered);

    // 4. Try fetching root /.env file if explicitly enabled
    if (options.autoFetchEnvFile === true && typeof window !== 'undefined') {
      tryFetchRootEnvFile().then((fileEnv) => {
        if (Object.keys(fileEnv).length > 0) {
          this.mergeDefaults(fileEnv);
        }
      });
    }


    // 5. Patch window.process.env
    this.patchProcessEnv();
  }

  private loadOverridesFromStorage(): void {
    try {
      const stored = this.storage.getItem(STORAGE_OVERRIDES_KEY);
      if (stored) {
        this.overrides = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[lamba] Failed to parse overrides from storage', e);
    }
  }

  private saveOverridesToStorage(): void {
    try {
      this.storage.setItem(STORAGE_OVERRIDES_KEY, JSON.stringify(this.overrides));
    } catch (e) {
      console.warn('[lamba] Failed to save overrides to storage', e);
    }
  }

  /**
   */
  private patchProcessEnv(): void {
    if (typeof window === 'undefined') return;

    const win = window as any;
    if (!win.process) {
      win.process = { env: {} };
    } else if (!win.process.env) {
      win.process.env = {};
    }

    const self = this;
    const targetEnv = win.process.env;

    // Use Proxy if supported
    try {
      win.process.env = new Proxy(targetEnv, {
        get(target, prop: string) {
          if (typeof prop === 'string') {
            const val = self.get(prop);
            if (val !== undefined) return val;
          }
          return target[prop];
        },
        set(target, prop: string, value: any) {
          target[prop] = value;
          return true;
        },
      });
    } catch (e) {
      // Fallback for environment where Proxy is restricted
    }
  }

  /**
   * Checks if an environment variable key satisfies the allowedPrefixes option.
   */
  public isAllowedKey(key: string): boolean {
    if (!this.allowedPrefixes) return true;

    if (typeof this.allowedPrefixes === 'string') {
      return key.startsWith(this.allowedPrefixes);
    }

    if (Array.isArray(this.allowedPrefixes)) {
      if (this.allowedPrefixes.length === 0) return true;
      return this.allowedPrefixes.some((p) => key.startsWith(p));
    }

    if (this.allowedPrefixes instanceof RegExp) {
      return this.allowedPrefixes.test(key);
    }

    return true;
  }

  public mergeDefaults(env: Record<string, any>): void {
    let changed = false;
    for (const [key, rawDefault] of Object.entries(env)) {
      if (!this.isAllowedKey(key)) continue;

      const defaultValue = rawDefault;
      const isOverridden = key in this.overrides;
      const currentValue = isOverridden ? this.overrides[key] : defaultValue;
      const isSecret = this.secretPattern.test(key);

      const existing = this.variables.get(key);
      if (!existing) {
        this.variables.set(key, {
          key,
          value: currentValue,
          defaultValue,
          isOverridden,
          isSecret,
        });
        changed = true;
      } else {
        // Update default value if changed
        if (existing.defaultValue !== defaultValue) {
          existing.defaultValue = defaultValue;
          if (!existing.isOverridden) {
            existing.value = defaultValue;
          }
          changed = true;
        }
      }
    }

    if (changed) {
      this.notifyStoreChanged();
    }
  }

  public get<T = any>(key: string, fallback?: T): T | undefined {
    if (key in this.overrides) {
      return this.overrides[key] as T;
    }
    const item = this.variables.get(key);
    if (item) return item.value as T;
    return fallback;
  }

  public getAll(): Record<string, EnvVariable> {
    const result: Record<string, EnvVariable> = {};
    this.variables.forEach((varObj, key) => {
      result[key] = { ...varObj };
    });
    return result;
  }

  public getOverrides(): Record<string, any> {
    return { ...this.overrides };
  }

  public setOverride(key: string, value: any): void {
    const trimmedKey = key.trim();
    if (!trimmedKey) return;

    this.overrides[trimmedKey] = value;
    this.saveOverridesToStorage();

    let item = this.variables.get(trimmedKey);
    if (!item) {
      item = {
        key: trimmedKey,
        value,
        defaultValue: '',
        isOverridden: true,
        isSecret: this.secretPattern.test(trimmedKey),
      };
      this.variables.set(trimmedKey, item);
    } else {
      item.value = value;
      item.isOverridden = true;
    }

    this.emitEnvChange(trimmedKey, value, true);
    this.notifyStoreChanged();
  }

  public removeOverride(key: string): void {
    if (key in this.overrides) {
      delete this.overrides[key];
      this.saveOverridesToStorage();

      const item = this.variables.get(key);
      if (item) {
        item.value = item.defaultValue;
        item.isOverridden = false;
        this.emitEnvChange(key, item.value, false);
      }

      this.notifyStoreChanged();
    }
  }

  public resetAllOverrides(): void {
    const keys = Object.keys(this.overrides);
    this.overrides = {};
    this.saveOverridesToStorage();
    this.presetManager.setActivePreset(null);

    keys.forEach((key) => {
      const item = this.variables.get(key);
      if (item) {
        item.value = item.defaultValue;
        item.isOverridden = false;
        this.emitEnvChange(key, item.value, false);
      }
    });

    this.notifyStoreChanged();
  }

  public applyPreset(presetId: string | null): void {
    const preset = this.presetManager.setActivePreset(presetId);
    this.overrides = preset ? { ...preset.overrides } : {};
    this.saveOverridesToStorage();

    // Re-evaluate all variables
    this.variables.forEach((item, key) => {
      if (key in this.overrides) {
        item.value = this.overrides[key];
        item.isOverridden = true;
      } else {
        item.value = item.defaultValue;
        item.isOverridden = false;
      }
      this.emitEnvChange(key, item.value, item.isOverridden);
    });

    // Also include extra override keys from preset that weren't in variables
    if (preset) {
      for (const [key, value] of Object.entries(preset.overrides)) {
        if (!this.variables.has(key)) {
          this.variables.set(key, {
            key,
            value,
            defaultValue: '',
            isOverridden: true,
            isSecret: this.secretPattern.test(key),
          });
          this.emitEnvChange(key, value, true);
        }
      }
    }

    this.notifyStoreChanged();
  }

  public subscribeEnvChange(listener: EnvChangeListener): () => void {
    this.envChangeListeners.add(listener);
    return () => this.envChangeListeners.delete(listener);
  }

  public subscribeStoreChange(listener: StoreChangeListener): () => void {
    this.storeChangeListeners.add(listener);
    return () => this.storeChangeListeners.delete(listener);
  }

  private emitEnvChange(key: string, value: string, isOverridden: boolean): void {
    this.envChangeListeners.forEach((fn) => fn(key, value, isOverridden));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('lamba:env-change', {
          detail: { key, value, isOverridden },
        })
      );
    }
  }

  private notifyStoreChanged(): void {
    const varsObj = this.getAll();
    const presets = this.presetManager.getPresets();
    const activePresetId = this.presetManager.getActivePresetId();
    this.storeChangeListeners.forEach((fn) => fn(varsObj, presets, activePresetId));
  }
}
