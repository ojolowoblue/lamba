export const LAMBA_STYLES = `
:host {
  /* === Lamba Logo Theme: Charcoal · Snake Green · Gold === */
  --lamba-bg-main: #090c0a;
  --lamba-bg-card: #111a13;
  --lamba-bg-hover: #1c2e1f;
  --lamba-border: rgba(34, 197, 94, 0.12);
  --lamba-text-primary: #e8f5ea;
  --lamba-text-secondary: #6b8f72;
  --lamba-primary: #22c55e;
  --lamba-primary-hover: #16a34a;
  --lamba-accent: #c9a84c;
  --lamba-success: #4ade80;
  --lamba-danger: #f87171;
  --lamba-warning: #c9a84c;
  --lamba-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --lamba-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.8), 0 8px 16px -6px rgba(34, 197, 94, 0.08);

  font-family: var(--lamba-font);
  font-size: 14px;
  line-height: 1.5;
  color: var(--lamba-text-primary);
  box-sizing: border-box;
  z-index: 999999;
}

*, *:before, *:after {
  box-sizing: border-box;
}

/* Floating Launcher Button */
.lamba-launcher {
  position: fixed;
  z-index: 999999;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 60%, #c9a84c 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 20px -3px rgba(34, 197, 94, 0.45), 0 4px 8px -4px rgba(201, 168, 76, 0.25);
  border: 1px solid rgba(201, 168, 76, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

.lamba-launcher:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 28px -3px rgba(34, 197, 94, 0.65), 0 6px 10px -4px rgba(201, 168, 76, 0.35);
}

.lamba-launcher:active {
  transform: scale(0.95);
}

.lamba-launcher-bottom-right { bottom: 24px; right: 24px; }
.lamba-launcher-bottom-left  { bottom: 24px; left: 24px; }
.lamba-launcher-top-right    { top: 24px; right: 24px; }
.lamba-launcher-top-left     { top: 24px; left: 24px; }

.lamba-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--lamba-accent);
  color: #0a0c09;
  font-size: 11px;
  font-weight: 700;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid var(--lamba-bg-main);
  box-shadow: 0 2px 6px rgba(201, 168, 76, 0.4);
  animation: pulse-scale 2s infinite;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Modal Overlay */
.lamba-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(5, 8, 5, 0.8);
  backdrop-filter: blur(10px);
  z-index: 999998;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lamba-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Main Modal Panel */
.lamba-modal {
  width: 100%;
  max-width: 820px;
  max-height: 85vh;
  background: var(--lamba-bg-main);
  border: 1px solid rgba(34, 197, 94, 0.18);
  border-radius: 16px;
  box-shadow: var(--lamba-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(20px) scale(0.96);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.lamba-overlay.active .lamba-modal {
  transform: translateY(0) scale(1);
}

/* Header */
.lamba-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(34, 197, 94, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, rgba(17, 26, 19, 0.9) 0%, rgba(9, 12, 10, 0.9) 100%);
}

.lamba-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lamba-logo {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #c9a84c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lamba-tag {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.lamba-close-btn {
  background: transparent;
  border: none;
  color: var(--lamba-text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.lamba-close-btn:hover {
  background: var(--lamba-bg-hover);
  color: var(--lamba-text-primary);
}

/* Controls Bar (Search & Filters) */
.lamba-controls {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(34, 197, 94, 0.1);
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  background: var(--lamba-bg-main);
}

.lamba-search-box {
  flex: 1;
  min-width: 220px;
  position: relative;
}

.lamba-search-input {
  width: 100%;
  padding: 10px 14px 10px 38px;
  background: var(--lamba-bg-card);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 8px;
  color: var(--lamba-text-primary);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease;
}

.lamba-search-input:focus {
  border-color: var(--lamba-primary);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.lamba-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--lamba-text-secondary);
  pointer-events: none;
}

.lamba-tabs {
  display: flex;
  gap: 4px;
  background: var(--lamba-bg-card);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid rgba(34, 197, 94, 0.12);
}

.lamba-tab {
  background: transparent;
  border: none;
  color: var(--lamba-text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lamba-tab.active {
  background: var(--lamba-primary);
  color: #050805;
}

/* Preset Bar */
.lamba-presets-bar {
  padding: 12px 24px;
  background: rgba(17, 26, 19, 0.5);
  border-bottom: 1px solid rgba(34, 197, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.lamba-preset-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.lamba-select {
  background: var(--lamba-bg-card);
  color: var(--lamba-text-primary);
  border: 1px solid rgba(34, 197, 94, 0.15);
  padding: 6px 12px;
  border-radius: 6px;
  outline: none;
  font-size: 13px;
  cursor: pointer;
}

/* List Content */
.lamba-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lamba-content::-webkit-scrollbar {
  width: 6px;
}

.lamba-content::-webkit-scrollbar-track {
  background: transparent;
}

.lamba-content::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.2);
  border-radius: 3px;
}

/* Variable Row Card */
.lamba-var-card {
  background: var(--lamba-bg-card);
  border: 1px solid rgba(34, 197, 94, 0.1);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s ease;
}

.lamba-var-card.is-overridden {
  border-color: rgba(34, 197, 94, 0.45);
  background: linear-gradient(180deg, var(--lamba-bg-card) 0%, rgba(34, 197, 94, 0.04) 100%);
}

.lamba-var-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lamba-var-key {
  font-weight: 700;
  font-family: monospace;
  color: #4ade80;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lamba-modified-pill {
  font-size: 10px;
  font-weight: 700;
  background: rgba(201, 168, 76, 0.15);
  color: #c9a84c;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(201, 168, 76, 0.3);
}

.lamba-var-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lamba-icon-btn {
  background: transparent;
  border: none;
  color: var(--lamba-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
}

.lamba-icon-btn:hover {
  background: var(--lamba-bg-hover);
  color: var(--lamba-primary);
}

.lamba-var-input-group {
  display: flex;
  gap: 8px;
}

.lamba-input {
  flex: 1;
  background: var(--lamba-bg-main);
  border: 1px solid rgba(34, 197, 94, 0.15);
  color: var(--lamba-text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
  outline: none;
}

.lamba-input:focus {
  border-color: var(--lamba-primary);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.lamba-diff {
  font-size: 11px;
  color: var(--lamba-text-secondary);
  font-family: monospace;
  padding-left: 2px;
}

.lamba-diff-val {
  color: var(--lamba-accent);
}

/* Empty State */
.lamba-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--lamba-text-secondary);
}

/* Footer Actions Bar */
.lamba-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(34, 197, 94, 0.12);
  background: linear-gradient(90deg, rgba(17, 26, 19, 0.9) 0%, rgba(9, 12, 10, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.lamba-btn {
  background: var(--lamba-bg-card);
  color: var(--lamba-text-primary);
  border: 1px solid rgba(34, 197, 94, 0.15);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.lamba-btn:hover {
  background: var(--lamba-bg-hover);
  border-color: rgba(34, 197, 94, 0.3);
}

.lamba-btn-primary {
  background: var(--lamba-primary);
  border-color: var(--lamba-primary);
  color: #050805;
}

.lamba-btn-primary:hover {
  background: var(--lamba-primary-hover);
  border-color: var(--lamba-primary-hover);
}

.lamba-btn-danger {
  background: rgba(248, 113, 113, 0.1);
  color: #fca5a5;
  border-color: rgba(248, 113, 113, 0.25);
}

.lamba-btn-danger:hover {
  background: rgba(248, 113, 113, 0.2);
}
`;
