import { LambaOptions, EnvChangeListener } from './core/types';
import { EnvStore } from './core/store';
import { NetworkInterceptor } from './core/network-interceptor';
import { createShadowHost } from './ui/shadow-dom';
import { LauncherUI } from './ui/launcher';
import { ModalUI } from './ui/modal';
import { createStorageAdapter } from './core/storage';

export class LambaManager {
  private store: EnvStore | null = null;
  private launcher: LauncherUI | null = null;
  private modal: ModalUI | null = null;
  private networkInterceptor: NetworkInterceptor | null = null;
  private options: LambaOptions = {};
  private isInitialized: boolean = false;

  /**
   * Implicit ES Proxy object where properties like `lamba.env.VITE_API_BASE_URL`
   * return the live active overridden value automatically.
   */
  public env: Record<string, any>;

  constructor() {
    const self = this;

    // Create implicit Proxy for lamba.env
    this.env = new Proxy({}, {
      get(_target, prop: string) {
        if (typeof prop === 'string') {
          return self.get(prop);
        }
        return undefined;
      },
      set(_target, prop: string, value: any) {
        if (typeof prop === 'string') {
          self.set(prop, value);
          return true;
        }
        return false;
      }
    });
  }

  /**
   * Wraps any environment object (such as `import.meta.env` or `process.env`)
   * in a dynamic proxy that implicitly resolves live overrides from lamba.
   */
  public wrap<T extends object>(targetEnv: T): T {
    if (!this.store) {
      this.init();
    }

    if (targetEnv && typeof targetEnv === 'object' && this.store) {
      try {
        const defaultObj: Record<string, any> = {};
        for (const [k, v] of Object.entries(targetEnv)) {
          defaultObj[k] = v;
        }
        if (Object.keys(defaultObj).length > 0) {
          this.store.mergeDefaults(defaultObj);
        }
      } catch (e) {
        // Ignore un-enumerable or restricted environment targets
      }
    }

    const self = this;
    return new Proxy(targetEnv, {
      get(target, prop: string | symbol) {
        if (typeof prop === 'string') {
          const overrideVal = self.get(prop);
          if (overrideVal !== undefined && overrideVal !== '') {
            const targetVal = Reflect.get(target, prop);
            if (typeof targetVal === 'boolean') {
              if (overrideVal === 'true' || overrideVal === true) return true;
              if (overrideVal === 'false' || overrideVal === false) return false;
            } else if (typeof targetVal === 'number' && typeof overrideVal === 'string') {
              const num = Number(overrideVal);
              if (!isNaN(num)) return num;
            }
            return overrideVal;
          }
        }
        return Reflect.get(target, prop);
      },
      set(target, prop: string | symbol, value: any) {
        if (typeof prop === 'string') {
          self.set(prop, value);
        }
        return Reflect.set(target, prop, value);
      }
    });
  }

  /**
   * Initializes lamba with custom options and mounts the floating UI.
   */
  public init(options: LambaOptions = {}): this {
    if (typeof window === 'undefined') return this;
    if (this.isInitialized) return this;

    this.options = {
      enabled: true,
      position: 'bottom-right',
      autoFetchEnvFile: false,
      interceptNetworkRequests: true,
      ...options,
    };


    if (this.options.enabled === false) {
      // Purge any stale lamba data left in storage so nothing lingers
      this.purge(options);
      return this;
    }

    // 1. Initialize Store
    this.store = new EnvStore(this.options);

    // 2. Initialize Network Interceptor if enabled
    if (this.options.interceptNetworkRequests !== false) {
      this.networkInterceptor = new NetworkInterceptor(this.store);
      this.networkInterceptor.enable();
    }

    // 3. Mount UI in Shadow DOM
    const mountUI = () => {
      if (this.launcher || !this.store) return;

      const { shadowRoot } = createShadowHost();

      this.modal = new ModalUI(shadowRoot, this.store, () => {
        // Modal closed callback
      });

      this.launcher = new LauncherUI(shadowRoot, this.options.position, () => {
        this.modal?.toggle();
      });

      // Sync badge count with initial store overrides count
      const initialOverridesCount = Object.keys(this.store.getOverrides()).length;
      this.launcher.updateBadgeCount(initialOverridesCount);

      // Subscribe launcher badge to store changes
      this.store.subscribeStoreChange(() => {
        const count = Object.keys(this.store!.getOverrides()).length;
        this.launcher?.updateBadgeCount(count);
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountUI);
    } else {
      mountUI();
    }

    this.isInitialized = true;
    return this;
  }

  /**
   * Gets the active value of an environment variable (returns overridden value if active, otherwise default).
   */
  public get<T = any>(key: string, fallback?: T): T {
    if (!this.store) {
      // Lazy init store if called before explicit init
      this.init();
    }
    return (this.store?.get<T>(key, fallback) ?? fallback) as T;
  }

  /**
   * Overrides an environment variable live at runtime.
   */
  public set(key: string, value: any): void {
    if (!this.store) this.init();
    this.store?.setOverride(key, value);
  }

  /**
   * Removes an override for a specific environment variable key.
   */
  public remove(key: string): void {
    this.store?.removeOverride(key);
  }

  /**
   * Resets all environment variable overrides.
   */
  public reset(): void {
    this.store?.resetAllOverrides();
  }

  /**
   * Removes ALL lamba data from storage (overrides, presets, active preset).
   * Safe to call even when lamba has not been initialized.
   * Useful when disabling lamba to ensure no stale data remains in the browser.
   *
   * @param options - Optionally pass storage options to target the correct adapter.
   *                  Defaults to 'local' (localStorage) to cover the common case.
   */
  public purge(options?: Pick<LambaOptions, 'storageStrategy' | 'storage'>): void {
    const adapter = this.store?.storage
      ?? createStorageAdapter(options?.storageStrategy ?? 'local', options?.storage);
    adapter.clear();
  }

  /**
   * Subscribes to environment variable changes.
   */
  public onChange(listener: EnvChangeListener): () => void {
    if (!this.store) this.init();
    return this.store?.subscribeEnvChange(listener) ?? (() => {});
  }

  /**
   * Programmatically opens the lamba floating modal.
   */
  public open(): void {
    this.modal?.open();
  }

  /**
   * Programmatically closes the lamba floating modal.
   */
  public close(): void {
    this.modal?.close();
  }

  /**
   * Programmatically toggles the lamba floating modal.
   */
  public toggle(): void {
    this.modal?.toggle();
  }

  /**
   * Fully tears down lamba: removes the floating UI from the DOM, disables the
   * network interceptor, and resets all internal state.
   *
   * Call this when you want to completely remove lamba at runtime, e.g. in
   * framework cleanup hooks or HMR dispose handlers.
   */
  public destroy(): void {
    // Remove the shadow host element from the DOM
    if (typeof document !== 'undefined') {
      const host = document.getElementById('lamba-root');
      host?.parentNode?.removeChild(host);
    }

    // Disable network interceptor
    this.networkInterceptor?.disable();
    this.networkInterceptor = null;

    // Nullify UI references
    this.launcher = null;
    this.modal = null;

    // Reset store and state
    this.store = null;
    this.isInitialized = false;
  }
}

// Global Singleton Instance
export const lamba = new LambaManager();

// Auto-initialize when included as a CDN script tag with explicit data attribute
if (typeof window !== 'undefined') {
  (window as any).lamba = lamba;

  const currentScript = document.currentScript as HTMLScriptElement | null;
  if (currentScript && (currentScript.hasAttribute('data-lamba-auto') || currentScript.hasAttribute('data-auto-init'))) {
    lamba.init();
  }
}

// HMR cleanup: when this module is hot-replaced or removed (e.g. Vite, webpack),
// tear down the floating UI so it doesn't linger in the DOM.
// Use try/catch to avoid bundler warnings in CJS/IIFE builds where import.meta is unavailable.
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — import.meta.hot is a Vite/webpack-specific API
  if (import.meta.hot) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import.meta.hot.dispose(() => {
      lamba.destroy();
    });
  }
} catch (_) {
  // Not an ESM/HMR environment — no-op
}

export default lamba;
export * from './core/types';
export { parseEnvString, stringifyEnv } from './core/env-parser';
export {
  type LambaStorageAdapter,
  LocalStorageAdapter,
  SessionStorageAdapter,
  MemoryStorageAdapter,
} from './core/storage';
