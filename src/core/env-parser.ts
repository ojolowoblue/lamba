/**
 * Parses raw .env string into a key-value Record.
 */
export function parseEnvString(rawText: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = rawText.split('\n');

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('export ')) {
      line = line.slice(7).trim();
    }

    const equalsIdx = line.indexOf('=');
    if (equalsIdx === -1) continue;

    const key = line.slice(0, equalsIdx).trim();
    let val = line.slice(equalsIdx + 1).trim();

    // Remove quotes if wrapped in single or double quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    // Replace escaped newlines
    val = val.replace(/\\n/g, '\n');

    if (key) {
      result[key] = val;
    }
  }

  return result;
}

/**
 * Stringifies a Record<string, string> into standard .env format.
 */
export function stringifyEnv(env: Record<string, string>): string {
  return Object.entries(env)
    .map(([key, val]) => {
      const needsQuotes = val.includes(' ') || val.includes('\n') || val.includes('#');
      const formattedVal = needsQuotes ? `"${val.replace(/"/g, '\\"')}"` : val;
      return `${key}=${formattedVal}`;
    })
    .join('\n');
}

/**
 * Auto-discovers environment variables available in the current browser runtime.
 */
export function autoDiscoverBrowserEnv(): Record<string, string> {
  const discovered: Record<string, string> = {};

  if (typeof window === 'undefined') return discovered;

  const extractPrimitiveProps = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        discovered[k] = String(v);
      }
    }
  };

  // 1. Inspect window.process.env
  try {
    const winProcess = (window as any).process;
    if (winProcess && winProcess.env && typeof winProcess.env === 'object') {
      extractPrimitiveProps(winProcess.env);
    }
  } catch (e) {}

  // 2. Inspect Next.js __NEXT_DATA__ env & runtimeConfig
  try {
    const nextData = (window as any).__NEXT_DATA__;
    if (nextData) {
      if (nextData.env) extractPrimitiveProps(nextData.env);
      if (nextData.runtimeConfig?.public) extractPrimitiveProps(nextData.runtimeConfig.public);
    }
  } catch (e) {}

  // 3. Inspect Nuxt __NUXT__ public runtime config
  try {
    const nuxtData = (window as any).__NUXT__;
    if (nuxtData?.config?.public) {
      extractPrimitiveProps(nuxtData.config.public);
    }
  } catch (e) {}

  // 4. Inspect window.__ENV__ or window.ENV or window.PUBLIC_ENV
  try {
    const win = window as any;
    const customEnv = win.__ENV__ || win.ENV || win.PUBLIC_ENV || win.__LAMBA_ENV__;
    if (customEnv) {
      extractPrimitiveProps(customEnv);
    }
  } catch (e) {}

  // 5. Inspect HTML meta tags (e.g. <meta name="env:API_KEY" content="xyz"> or <meta name="lamba-env" content="API_KEY=xyz&MODE=dev">)
  try {
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach((meta) => {
      const name = meta.getAttribute('name');
      const content = meta.getAttribute('content');
      if (!name || content === null) return;

      if (name.startsWith('env:')) {
        const key = name.slice(4);
        discovered[key] = content;
      } else if (name === 'lamba-env') {
        const parsed = new URLSearchParams(content);
        parsed.forEach((val, key) => {
          discovered[key] = val;
        });
      }
    });
  } catch (e) {}

  return discovered;
}

/**
 * Attempts to fetch /.env or /.env.example from root URL if hosted in dev mode.
 */
export async function tryFetchRootEnvFile(): Promise<Record<string, string>> {
  const paths = ['/.env', '/.env.local', '/.env.example'];
  for (const path of paths) {
    try {
      const res = await fetch(path, { headers: { Accept: 'text/plain' } });
      if (res.ok) {
        const text = await res.text();
        if (text && text.includes('=')) {
          return parseEnvString(text);
        }
      }
    } catch (e) {
      // Ignore network errors in production or non-accessible env files
    }
  }
  return {};
}
