export class LauncherUI {
  private element: HTMLElement;
  private badgeElement: HTMLElement;
  private onClickCallback: () => void;

  constructor(
    container: ShadowRoot,
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right',
    onClick: () => void
  ) {
    this.onClickCallback = onClick;

    this.element = document.createElement('div');
    this.element.className = `lamba-launcher lamba-launcher-${position}`;
    this.element.title = 'Open lamba Environment Controls';

    // SVG Settings Icon
    this.element.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;

    // Counter Badge
    this.badgeElement = document.createElement('div');
    this.badgeElement.className = 'lamba-badge';
    this.badgeElement.style.display = 'none';
    this.element.appendChild(this.badgeElement);

    this.element.addEventListener('click', () => this.onClickCallback());
    container.appendChild(this.element);
  }

  public updateBadgeCount(count: number): void {
    if (count > 0) {
      this.badgeElement.textContent = String(count);
      this.badgeElement.style.display = 'flex';
    } else {
      this.badgeElement.style.display = 'none';
    }
  }

  public setVisible(visible: boolean): void {
    this.element.style.display = visible ? 'flex' : 'none';
  }
}
