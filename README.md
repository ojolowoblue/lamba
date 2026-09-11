# lamba ⚡

**`lamba`** is a universal, lightweight developer tool for viewing, overriding, and swapping environment variables live in web applications (React, Vue, Next.js, Astro, Vite, Svelte, or Vanilla HTML/JS).

Deployed on CDN (`unpkg.com`) or installed via NPM, `lamba` injects a non-intrusive floating UI powered by Shadow DOM. Devs and QA engineers can test multiple environments, switch API keys, swap backend clusters, and save preset profiles live in the browser without modifying source code or updating `.env` files.

---

## 🌟 Highlights

- ⚡ **Zero Setup CDN**: Load a single `<script>` tag from `unpkg.com` and start tweaking `.env` variables live.
- 🛡️ **Shadow DOM Encapsulation**: Modern glassmorphism UI rendered inside a Custom Element (`<lamba-widget>`), ensuring zero CSS leak into or out of your app.
- 🎛️ **Preset Manager**: Save named environment snapshots (e.g. *Staging API*, *Local Mock Server*, *QA Test Suite*) and switch between them in 1 click.
- 🔒 **Secret Masking**: Automatically detects sensitive keys (`SECRET`, `TOKEN`, `PASSWORD`, `KEY`, `AUTH`) and masks them with toggle visibility.
- 📦 **Framework Agnostic & React / Vue Hooks**: Works out of the box with plain JS, or via native `useLambaEnv` hooks in React & Vue.
- 📁 **Import & Export**: Bulk import `.env` files or export your live modified config to `.env` or `.json`.

---

## ⚡ Implicit Operation (Zero Code Change Required)

`lamba` is designed to be **100% implicit**. Developers do not need to rewrite code or explicitly call `lamba.get()`.

### 1. Automatic Outbound Network URL Interception (`fetch` & `XHR`)
When you override a base URL variable in `lamba` (e.g., `VITE_API_BASE_URL` from `https://api.dev.com` -> `https://staging.dev.com`), `lamba` automatically intercepts all outbound `fetch()` and `XMLHttpRequest` calls that hit the default URL and redirects them to your active overridden server on the fly!

```typescript
// Developer writes standard code — ZERO changes needed!
fetch('https://api.dev.com/v1/users'); 
// ⚡ Automatically redirected to https://staging.dev.com/v1/users when overridden in lamba!
```

### 2. Implicit `process.env` & `lamba.env` Proxies
Access environment variables dynamically via patched `process.env` or `lamba.env`:

```typescript
// Implicit property access
const title = window.process.env.VITE_APP_TITLE;
const apiKey = lamba.env.VITE_API_KEY;
```

### 3. Transparent Environment Wrapper (`lamba.wrap()`)
Wrap your Vite / Webpack env object once:

```typescript
// src/config.ts
import lamba from 'lamba';

// Wraps import.meta.env or process.env in a dynamic proxy
export const env = lamba.wrap(import.meta.env);

// Access keys implicitly anywhere:
console.log(env.VITE_API_BASE_URL); // Resolves live override or default automatically
```


### Option 1: Via CDN (unpkg.com / jsdelivr)
Add the script tag to your `index.html` file:

```html
<script src="https://unpkg.com/lamba"></script>
```

That's it! A floating settings button (⚙️) will appear in the bottom-right corner of your web page.

### Option 2: Via NPM (Module Bundlers)

```bash
npm install lamba
# or
yarn add lamba
# or
pnpm add lamba
```

Initialize in your application entrypoint:

```typescript
import lamba from 'lamba';

lamba.init({
  position: 'bottom-right',
  env: {
    VITE_API_BASE_URL: 'https://api.example.com',
    FEATURE_NEW_CHECKOUT: 'true'
  }
});
```

---

## ⚛️ React Integration

```tsx
import { useLambaEnv } from 'lamba/react';

function Dashboard() {
  const apiBase = useLambaEnv('VITE_API_BASE_URL', 'https://api.default.com');
  const enableNewUi = useLambaEnv('FEATURE_NEW_UI', 'false');

  return (
    <div>
      <h1>API URL: {apiBase}</h1>
      {enableNewUi === 'true' && <NewFeatureComponent />}
    </div>
  );
}
```

---

## 🟢 Vue Integration

```vue
<script setup>
import { useLambaEnv } from 'lamba/vue';

const apiBase = useLambaEnv('VITE_API_BASE_URL', 'https://api.default.com');
</script>

<template>
  <div>Connecting to: {{ apiBase }}</div>
</template>
```

---

## 🛠️ API Reference

### `lamba.init(options?: LambaOptions)`
Initializes the lamba manager and mounts the floating widget.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `env` | `Record<string, string>` | `{}` | Initial default environment variables |
| `enabled` | `boolean` | `true` | Whether floating UI is enabled |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Floating launcher position |
| `secretKeysPattern` | `RegExp` | `/(KEY\|SECRET\|TOKEN\|PASSWORD)/i` | Regex to auto-mask sensitive keys |
| `autoFetchEnvFile` | `boolean` | `true` | Attempt to auto-fetch root `/.env` in dev mode |

### `lamba.get(key: string, fallback?: string): string`
Returns the active value of an environment variable (returns overridden value if set, otherwise default value).

### `lamba.set(key: string, value: string): void`
Programmatically overrides an environment variable live at runtime.

### `lamba.reset(): void`
Resets all overrides back to their original default values.

### `lamba.onChange(callback: (key, value, isOverridden) => void): () => void`
Subscribes to live environment variable updates from the lamba UI.

---

## 📄 License

MIT License © 2026
