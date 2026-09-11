export const LAMBA_STYLES = `
:host {
  --lamba-bg-main: #0f172a;
  --lamba-bg-card: #1e293b;
  --lamba-bg-hover: #334155;
  --lamba-border: rgba(255, 255, 255, 0.1);
  --lamba-text-primary: #f8fafc;
  --lamba-text-secondary: #94a3b8;
  --lamba-primary: #6366f1;
  --lamba-primary-hover: #4f46e5;
  --lamba-accent: #06b6d4;
  --lamba-success: #10b981;
  --lamba-danger: #ef4444;
  --lamba-warning: #f59e0b;
  --lamba-font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --lamba-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);

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
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4), 0 4px 6px -4px rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
}

.lamba-launcher:hover {
  transform: scale(1.08);
  box-shadow: 0 14px 20px -3px rgba(99, 102, 241, 0.6), 0 6px 8px -4px rgba(99, 102, 241, 0.3);
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
  color: #000;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
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
  border: 1px solid var(--lamba-border);
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
  border-bottom: 1px solid var(--lamba-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.4);
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
  background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lamba-tag {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.3);
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
  border-bottom: 1px solid var(--lamba-border);
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
  border: 1px solid var(--lamba-border);
  border-radius: 8px;
  color: var(--lamba-text-primary);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s ease;
}

.lamba-search-input:focus {
  border-color: var(--lamba-primary);
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
  border: 1px solid var(--lamba-border);
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
  color: #ffffff;
}

/* Preset Bar */
.lamba-presets-bar {
  padding: 12px 24px;
  background: rgba(30, 41, 59, 0.3);
  border-bottom: 1px solid var(--lamba-border);
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
  border: 1px solid var(--lamba-border);
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
  background: var(--lamba-bg-hover);
  border-radius: 3px;
}

/* Variable Row Card */
.lamba-var-card {
  background: var(--lamba-bg-card);
  border: 1px solid var(--lamba-border);
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s ease;
}

.lamba-var-card.is-overridden {
  border-color: rgba(99, 102, 241, 0.5);
  background: linear-gradient(180deg, var(--lamba-bg-card) 0%, rgba(99, 102, 241, 0.05) 100%);
}

.lamba-var-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lamba-var-key {
  font-weight: 700;
  font-family: monospace;
  color: #a5b4fc;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lamba-modified-pill {
  font-size: 10px;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(16, 185, 129, 0.4);
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
  color: var(--lamba-text-primary);
}

.lamba-var-input-group {
  display: flex;
  gap: 8px;
}

.lamba-input {
  flex: 1;
  background: var(--lamba-bg-main);
  border: 1px solid var(--lamba-border);
  color: var(--lamba-text-primary);
  padding: 8px 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
  outline: none;
}

.lamba-input:focus {
  border-color: var(--lamba-primary);
}

.lamba-diff {
  font-size: 11px;
  color: var(--lamba-text-secondary);
  font-family: monospace;
  padding-left: 2px;
}

.lamba-diff-val {
  color: var(--lamba-warning);
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
  border-top: 1px solid var(--lamba-border);
  background: rgba(30, 41, 59, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.lamba-btn {
  background: var(--lamba-bg-card);
  color: var(--lamba-text-primary);
  border: 1px solid var(--lamba-border);
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
}

.lamba-btn-primary {
  background: var(--lamba-primary);
  border-color: var(--lamba-primary);
  color: #ffffff;
}

.lamba-btn-primary:hover {
  background: var(--lamba-primary-hover);
}

.lamba-btn-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.3);
}

.lamba-btn-danger:hover {
  background: rgba(239, 68, 68, 0.3);
}
`;
