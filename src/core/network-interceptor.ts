import { EnvStore } from './store';

export class NetworkInterceptor {
  private store: EnvStore;
  private originalFetch: typeof window.fetch | null = null;
  private originalXHRPost: typeof XMLHttpRequest.prototype.open | null = null;
  private isIntercepting: boolean = false;

  constructor(store: EnvStore) {
    this.store = store;
  }

  public enable(): void {
    if (typeof window === 'undefined' || this.isIntercepting) return;

    this.patchFetch();
    this.patchXHR();
    this.isIntercepting = true;
  }

  public disable(): void {
    if (typeof window === 'undefined' || !this.isIntercepting) return;

    if (this.originalFetch) {
      window.fetch = this.originalFetch;
      this.originalFetch = null;
    }
    if (this.originalXHRPost) {
      XMLHttpRequest.prototype.open = this.originalXHRPost;
      this.originalXHRPost = null;
    }
    this.isIntercepting = false;
  }

  /**
   * Rewrite a given URL by checking if any default env variable URL value matches
   * and replacing it with the active overridden value.
   */
  public rewriteUrl(url: string | URL | Request): string | URL | Request {
    if (typeof url !== 'string') return url;

    const allVars = this.store.getAll();
    let resultUrl = url;

    for (const varObj of Object.values(allVars)) {
      if (varObj.isOverridden && varObj.defaultValue && varObj.value) {
        // Trim trailing slashes for accurate matching
        const defaultBase = varObj.defaultValue.replace(/\/+$/, '');
        const overrideBase = varObj.value.replace(/\/+$/, '');

        if (defaultBase && resultUrl.includes(defaultBase)) {
          resultUrl = resultUrl.replace(defaultBase, overrideBase);
        }
      }
    }

    return resultUrl;
  }

  private patchFetch(): void {
    if (!window.fetch) return;

    this.originalFetch = window.fetch;
    const self = this;

    window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      let finalInput = input;

      if (typeof input === 'string') {
        finalInput = self.rewriteUrl(input) as string;
      } else if (input instanceof URL) {
        const rewritten = self.rewriteUrl(input.toString()) as string;
        finalInput = new URL(rewritten);
      } else if (input instanceof Request) {
        const rewrittenUrl = self.rewriteUrl(input.url) as string;
        if (rewrittenUrl !== input.url) {
          finalInput = new Request(rewrittenUrl, input);
        }
      }

      return self.originalFetch!.call(this, finalInput, init);
    };
  }

  private patchXHR(): void {
    if (!window.XMLHttpRequest) return;

    this.originalXHRPost = XMLHttpRequest.prototype.open;
    const self = this;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null
    ): void {
      const stringUrl = typeof url === 'string' ? url : url.toString();
      const rewrittenUrl = self.rewriteUrl(stringUrl) as string;

      return self.originalXHRPost!.call(
        this,
        method,
        rewrittenUrl,
        async,
        username ?? null,
        password ?? null
      );
    };
  }
}
