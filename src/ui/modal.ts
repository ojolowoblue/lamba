import { EnvStore } from '../core/store';
import { EnvVariable, PresetProfile } from '../core/types';
import { parseEnvString, stringifyEnv } from '../core/env-parser';

export class ModalUI {
  private overlay: HTMLElement;
  private modal: HTMLElement;
  private contentList: HTMLElement;
  private searchInput: HTMLInputElement;
  private tabAllBtn: HTMLElement;
  private tabOverriddenBtn: HTMLElement;
  private tabSecretsBtn: HTMLElement;
  private presetSelect: HTMLSelectElement;
  private savePresetBtn: HTMLElement;
  private activeTab: 'all' | 'overridden' | 'secrets' = 'all';
  private searchQuery: string = '';
  private store: EnvStore;
  private secretVisibilityMap: Map<string, boolean> = new Map();
  private isOpen: boolean = false;

  constructor(container: ShadowRoot, store: EnvStore, onClose: () => void) {
    this.store = store;

    // Build DOM layout
    this.overlay = document.createElement('div');
    this.overlay.className = 'lamba-overlay';

    this.modal = document.createElement('div');
    this.modal.className = 'lamba-modal';

    // Header
    const header = document.createElement('div');
    header.className = 'lamba-header';
    header.innerHTML = `
      <div class="lamba-brand">
        <div class="lamba-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          lamba
        </div>
        <span class="lamba-tag">Dev Environment Override</span>
      </div>
      <button class="lamba-close-btn" title="Close modal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    header.querySelector('.lamba-close-btn')?.addEventListener('click', () => {
      this.close();
      onClose();
    });

    // Controls Bar (Search & Filter Tabs)
    const controls = document.createElement('div');
    controls.className = 'lamba-controls';

    const searchBox = document.createElement('div');
    searchBox.className = 'lamba-search-box';
    searchBox.innerHTML = `
      <svg class="lamba-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" class="lamba-search-input" placeholder="Search environment keys or values..." />
    `;
    this.searchInput = searchBox.querySelector('.lamba-search-input') as HTMLInputElement;
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value.toLowerCase();
      this.render();
    });

    const tabs = document.createElement('div');
    tabs.className = 'lamba-tabs';
    tabs.innerHTML = `
      <button class="lamba-tab active" data-tab="all">All</button>
      <button class="lamba-tab" data-tab="overridden">Modified</button>
      <button class="lamba-tab" data-tab="secrets">Secrets</button>
    `;

    this.tabAllBtn = tabs.querySelector('[data-tab="all"]') as HTMLElement;
    this.tabOverriddenBtn = tabs.querySelector('[data-tab="overridden"]') as HTMLElement;
    this.tabSecretsBtn = tabs.querySelector('[data-tab="secrets"]') as HTMLElement;

    tabs.querySelectorAll('.lamba-tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        tabs.querySelectorAll('.lamba-tab').forEach((t) => t.classList.remove('active'));
        const target = e.currentTarget as HTMLElement;
        target.classList.add('active');
        this.activeTab = target.getAttribute('data-tab') as any;
        this.render();
      });
    });

    controls.appendChild(searchBox);
    controls.appendChild(tabs);

    // Presets Bar
    const presetsBar = document.createElement('div');
    presetsBar.className = 'lamba-presets-bar';
    presetsBar.innerHTML = `
      <div class="lamba-preset-selector">
        <span style="color: var(--lamba-text-secondary); font-weight: 600;">Preset Profile:</span>
        <select class="lamba-select lamba-preset-dropdown">
          <option value="">Default (Current Overrides)</option>
        </select>
      </div>
      <button class="lamba-btn lamba-save-preset-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Save as Preset
      </button>
    `;

    this.presetSelect = presetsBar.querySelector('.lamba-preset-dropdown') as HTMLSelectElement;
    this.presetSelect.addEventListener('change', () => {
      const selectedId = this.presetSelect.value || null;
      this.store.applyPreset(selectedId);
    });

    this.savePresetBtn = presetsBar.querySelector('.lamba-save-preset-btn') as HTMLElement;
    this.savePresetBtn.addEventListener('click', () => {
      const name = prompt('Enter a name for this Environment Preset Profile:', 'Staging Environment');
      if (name) {
        const overrides = this.store.getOverrides();
        this.store.presetManager.createPreset(name, overrides);
        this.updatePresetDropdown();
      }
    });

    // Content List Container
    this.contentList = document.createElement('div');
    this.contentList.className = 'lamba-content';

    // Footer Bar
    const footer = document.createElement('div');
    footer.className = 'lamba-footer';
    footer.innerHTML = `
      <div style="display: flex; gap: 8px;">
        <button class="lamba-btn lamba-add-var-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Variable
        </button>
        <button class="lamba-btn lamba-import-btn">Import .env</button>
        <button class="lamba-btn lamba-export-btn">Export .env</button>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="lamba-btn lamba-btn-danger lamba-reset-all-btn">Reset All</button>
        <button class="lamba-btn lamba-btn-primary lamba-reload-btn">Reload Page</button>
      </div>
    `;

    footer.querySelector('.lamba-add-var-btn')?.addEventListener('click', () => {
      const key = prompt('Enter new environment variable key name (e.g. API_URL, NEXT_PUBLIC_API_URL, REACT_APP_API_URL, VITE_API_URL):');
      if (key) {
        const value = prompt(`Enter value for ${key}:`) || '';
        this.store.setOverride(key, value);
      }
    });

    footer.querySelector('.lamba-import-btn')?.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.env,.txt';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
              const parsed = parseEnvString(content);
              for (const [k, v] of Object.entries(parsed)) {
                this.store.setOverride(k, v);
              }
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    });

    footer.querySelector('.lamba-export-btn')?.addEventListener('click', () => {
      const allVars = this.store.getAll();
      const exportObj: Record<string, string> = {};
      for (const [k, v] of Object.entries(allVars)) {
        exportObj[k] = v.value;
      }
      const envText = stringifyEnv(exportObj);
      const blob = new Blob([envText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '.env';
      a.click();
      URL.revokeObjectURL(url);
    });

    footer.querySelector('.lamba-reset-all-btn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all overridden environment variables?')) {
        this.store.resetAllOverrides();
      }
    });

    footer.querySelector('.lamba-reload-btn')?.addEventListener('click', () => {
      window.location.reload();
    });

    // Assemble modal structure
    this.modal.appendChild(header);
    this.modal.appendChild(controls);
    this.modal.appendChild(presetsBar);
    this.modal.appendChild(this.contentList);
    this.modal.appendChild(footer);
    this.overlay.appendChild(this.modal);

    // Close on overlay background click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
        onClose();
      }
    });

    container.appendChild(this.overlay);

    // Subscribe to store updates
    this.store.subscribeStoreChange(() => {
      if (this.isOpen) {
        this.updatePresetDropdown();
        this.render();
      }
    });
  }

  public open(): void {
    this.isOpen = true;
    this.updatePresetDropdown();
    this.render();
    this.overlay.classList.add('active');
  }

  public close(): void {
    this.isOpen = false;
    this.overlay.classList.remove('active');
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private updatePresetDropdown(): void {
    const presets = this.store.presetManager.getPresets();
    const activeId = this.store.presetManager.getActivePresetId();

    this.presetSelect.innerHTML = `<option value="">Default (Custom Overrides)</option>`;
    presets.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      if (p.id === activeId) opt.selected = true;
      this.presetSelect.appendChild(opt);
    });
  }

  public render(): void {
    const allVarsMap = this.store.getAll();
    let varList = Object.values(allVarsMap);

    // Filter by Tab
    if (this.activeTab === 'overridden') {
      varList = varList.filter((v) => v.isOverridden);
    } else if (this.activeTab === 'secrets') {
      varList = varList.filter((v) => v.isSecret);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      varList = varList.filter(
        (v) =>
          v.key.toLowerCase().includes(this.searchQuery) ||
          v.value.toLowerCase().includes(this.searchQuery)
      );
    }

    // Sort by overridden first, then alphabetically
    varList.sort((a, b) => {
      if (a.isOverridden !== b.isOverridden) {
        return a.isOverridden ? -1 : 1;
      }
      return a.key.localeCompare(b.key);
    });

    this.contentList.innerHTML = '';

    if (varList.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'lamba-empty';
      empty.textContent =
        this.searchQuery || this.activeTab !== 'all'
          ? 'No environment variables match your current filter.'
          : 'No environment variables found or registered. Click "+ Add Variable" or "Import .env" to get started.';
      this.contentList.appendChild(empty);
      return;
    }

    varList.forEach((varItem) => {
      const card = this.createVarCard(varItem);
      this.contentList.appendChild(card);
    });
  }

  private createVarCard(varItem: EnvVariable): HTMLElement {
    const card = document.createElement('div');
    card.className = `lamba-var-card ${varItem.isOverridden ? 'is-overridden' : ''}`;

    const isVisible = this.secretVisibilityMap.get(varItem.key) ?? !varItem.isSecret;

    card.innerHTML = `
      <div class="lamba-var-meta">
        <div class="lamba-var-key">
          ${varItem.key}
          ${varItem.isOverridden ? '<span class="lamba-modified-pill">MODIFIED</span>' : ''}
          ${varItem.isSecret ? '<span style="font-size:10px; color:var(--lamba-warning); font-weight:600;">SECRET</span>' : ''}
        </div>
        <div class="lamba-var-actions">
          ${
            varItem.isSecret
              ? `<button class="lamba-icon-btn toggle-secret-btn" title="${isVisible ? 'Hide secret' : 'Show secret'}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${
                      isVisible
                        ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
                        : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
                    }
                  </svg>
                </button>`
              : ''
          }
          ${
            varItem.isOverridden
              ? `<button class="lamba-icon-btn reset-var-btn" title="Reset to default">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                </button>`
              : ''
          }
        </div>
      </div>
      <div class="lamba-var-input-group">
        <input 
          type="${isVisible ? 'text' : 'password'}" 
          class="lamba-input var-input" 
          value="${this.escapeHtml(varItem.value)}" 
          placeholder="Value..."
        />
      </div>
      ${
        varItem.isOverridden && varItem.defaultValue
          ? `<div class="lamba-diff">Original default: <span class="lamba-diff-val">${this.escapeHtml(
              varItem.defaultValue
            )}</span></div>`
          : ''
      }
    `;

    const inputEl = card.querySelector('.var-input') as HTMLInputElement;
    inputEl.addEventListener('change', () => {
      this.store.setOverride(varItem.key, inputEl.value);
    });

    card.querySelector('.toggle-secret-btn')?.addEventListener('click', () => {
      this.secretVisibilityMap.set(varItem.key, !isVisible);
      this.render();
    });

    card.querySelector('.reset-var-btn')?.addEventListener('click', () => {
      this.store.removeOverride(varItem.key);
    });

    return card;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
