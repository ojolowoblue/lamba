import { LAMBA_STYLES } from './styles';

export function createShadowHost(): { host: HTMLElement; shadowRoot: ShadowRoot } {
  if (typeof document === 'undefined') {
    throw new Error('[lamba] Document object not available.');
  }

  let host = document.getElementById('lamba-root') as HTMLElement;
  if (!host) {
    host = document.createElement('lamba-widget');
    host.id = 'lamba-root';
    document.body.appendChild(host);
  }

  let shadowRoot = host.shadowRoot;
  if (!shadowRoot) {
    shadowRoot = host.attachShadow({ mode: 'open' });

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = LAMBA_STYLES;
    shadowRoot.appendChild(styleEl);
  }

  return { host, shadowRoot };
}
