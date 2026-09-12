import { PresetProfile } from './types';
import { LambaStorageAdapter } from './storage';

const STORAGE_PRESETS_KEY = '__lamba_presets__';
const STORAGE_ACTIVE_PRESET_KEY = '__lamba_active_preset__';

export class PresetManager {
  private presets: PresetProfile[] = [];
  private activePresetId: string | null = null;
  private storage: LambaStorageAdapter;

  constructor(storage: LambaStorageAdapter) {
    this.storage = storage;
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const rawPresets = this.storage.getItem(STORAGE_PRESETS_KEY);
      if (rawPresets) {
        this.presets = JSON.parse(rawPresets);
      }
      this.activePresetId = this.storage.getItem(STORAGE_ACTIVE_PRESET_KEY);
    } catch (e) {
      console.warn('[lamba] Failed to parse presets from storage', e);
    }
  }

  private saveToStorage(): void {
    try {
      this.storage.setItem(STORAGE_PRESETS_KEY, JSON.stringify(this.presets));
      if (this.activePresetId) {
        this.storage.setItem(STORAGE_ACTIVE_PRESET_KEY, this.activePresetId);
      } else {
        this.storage.removeItem(STORAGE_ACTIVE_PRESET_KEY);
      }
    } catch (e) {
      console.warn('[lamba] Failed to save presets to storage', e);
    }
  }

  public getPresets(): PresetProfile[] {
    return [...this.presets];
  }

  public getActivePresetId(): string | null {
    return this.activePresetId;
  }

  public createPreset(name: string, overrides: Record<string, any>): PresetProfile {
    const newPreset: PresetProfile = {
      id: 'preset_' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || 'Untitled Preset',
      overrides: { ...overrides },
      createdAt: Date.now(),
    };

    this.presets.push(newPreset);
    this.saveToStorage();
    return newPreset;
  }

  public deletePreset(id: string): void {
    this.presets = this.presets.filter((p) => p.id !== id);
    if (this.activePresetId === id) {
      this.activePresetId = null;
    }
    this.saveToStorage();
  }

  public setActivePreset(id: string | null): PresetProfile | null {
    if (!id) {
      this.activePresetId = null;
      this.saveToStorage();
      return null;
    }

    const preset = this.presets.find((p) => p.id === id);
    if (preset) {
      this.activePresetId = id;
      this.saveToStorage();
      return preset;
    }
    return null;
  }
}
