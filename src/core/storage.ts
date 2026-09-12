/**
 * Abstract interface for pluggable storage backends used by lamba to persist
 * overrides and presets. All methods are synchronous for simplicity (async
 * adapters can wrap with Promises if needed in custom implementations).
 */
export interface LambaStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

/**
 * LocalStorage-backed adapter (default).
 * Overrides persist indefinitely across tabs and page reloads.
 * Visible in DevTools → Application → Local Storage.
 */
export class LocalStorageAdapter implements LambaStorageAdapter {
  getItem(key: string): string | null {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch {}
  }

  removeItem(key: string): void {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    } catch {}
  }

  clear(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('__lamba_overrides__');
        localStorage.removeItem('__lamba_presets__');
        localStorage.removeItem('__lamba_active_preset__');
      }
    } catch {}
  }
}

/**
 * SessionStorage-backed adapter.
 * Overrides survive page reloads within the same tab, but are automatically
 * destroyed when the tab is closed. Still visible in DevTools Storage panel.
 */
export class SessionStorageAdapter implements LambaStorageAdapter {
  getItem(key: string): string | null {
    try {
      return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, value);
    } catch {}
  }

  removeItem(key: string): void {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key);
    } catch {}
  }

  clear(): void {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('__lamba_overrides__');
        sessionStorage.removeItem('__lamba_presets__');
        sessionStorage.removeItem('__lamba_active_preset__');
      }
    } catch {}
  }
}

/**
 * In-memory adapter.
 * The most secure option: zero bytes written to any browser storage mechanism.
 * Overrides exist only in JavaScript heap memory and are destroyed when the
 * tab/page is closed or navigated away. Nothing appears in DevTools Storage.
 */
export class MemoryStorageAdapter implements LambaStorageAdapter {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

/**
 * Factory function that creates the appropriate storage adapter from a
 * `storageStrategy` string or a user-supplied custom adapter.
 */
export function createStorageAdapter(
  strategy: 'local' | 'session' | 'memory' = 'local',
  custom?: LambaStorageAdapter,
): LambaStorageAdapter {
  if (custom) return custom;

  switch (strategy) {
    case 'session':
      return new SessionStorageAdapter();
    case 'memory':
      return new MemoryStorageAdapter();
    case 'local':
    default:
      return new LocalStorageAdapter();
  }
}
