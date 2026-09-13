# lamba ⚡

<p align="center">
  <img src="logo.jpg" alt="lamba logo" width="180" />
</p>

**`lamba`** is a universal, lightweight developer tool and browser widget for viewing, overriding, and swapping environment variables live in web applications—supporting **all framework prefixes** (`VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`, `VUE_APP_`, `PUBLIC_`, `EXPO_PUBLIC_`, `NUXT_`, `GATSBY_`, or unprefixed keys) across React, Vue, Next.js, Vite, Create React App, Astro, Nuxt, Svelte, or Vanilla HTML/JS—**without touching source code, restarting dev servers, or editing `.env` files.**

Deployed via CDN or installed via NPM, `lamba` injects a non-intrusive floating UI powered by **Shadow DOM encapsulation**. Devs, QA engineers, and project managers can test multiple API environments, toggle feature flags, switch authentication tokens, and swap backend clusters on the fly directly in the browser.

---

## 🌟 Key Features

- ⚡ **Zero-Setup CDN & NPM Support**: Add a single `<script>` tag or install via NPM/Yarn/PNPM.
- 🌐 **Universal Framework & Prefix Support**: Works out of the box with any env variable prefix (`VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`, `VUE_APP_`, `PUBLIC_`, `EXPO_PUBLIC_`, `NUXT_`, `GATSBY_`) or unprefixed variables.
- 🛡️ **Shadow DOM Encapsulation**: Modern glassmorphism UI rendered inside a Custom Element (`<lamba-widget>`), ensuring zero CSS style leakage into or out of your app.
- 🌐 **Automatic Network Interception**: Automatically intercepts outbound `fetch()` and `XMLHttpRequest` calls hitting default base URLs and redirects them to your live active environment overrides on the fly.
- 🎛️ **Preset Profile Manager**: Save named environment snapshots (e.g., *Staging API*, *Local Mock Server*, *QA Test Suite*, *Production Read-Only*) and switch between them with one click.
- 🔒 **Automatic Secret Masking**: Detects sensitive environment keys (`SECRET`, `TOKEN`, `PASSWORD`, `KEY`, `AUTH`, `PRIVATE`) and automatically masks them with toggle visibility.
- ⚛️ **Framework Agnostic + React & Vue Hooks**: Built-in `useLambaEnv` reactive hooks/composables for React and Vue, plus standard TypeScript APIs.
- 📁 **Bulk Import & Export**: Import existing `.env` files or export modified configurations directly to `.env` or JSON format.
- 💾 **Persistent Overrides**: Overridden variables persist seamlessly across page reloads using browser `localStorage`.

---

## 🚀 Quick Start

### Option 1: CDN (Zero Build Setup)

Include the script tag in your `index.html` file before your application bundle:

```html
<script src="https://unpkg.com/@ojolowoblue/lamba" data-lamba-auto></script>
```

That's it! A floating settings button (⚙️) will automatically appear in the bottom-right corner of your web page.

### Option 2: NPM / Package Manager

Install `lamba` in your project:

```bash
npm install @ojolowoblue/lamba
# or
yarn add @ojolowoblue/lamba
# or
pnpm add @ojolowoblue/lamba
```

Initialize `lamba` in your application entrypoint (`src/main.ts` or `src/index.js`):

```typescript
import lamba from '@ojolowoblue/lamba';

lamba.init({
  position: 'bottom-right',
  env: {
    // Supports any data type (strings, numbers, booleans, objects) & any prefix:
    NEXT_PUBLIC_API_URL: 'https://api.dev.example.com',
    PORT: 3000,
    VITE_ENABLE_ANALYTICS: true,
    FEATURE_FLAGS: { newCheckout: true },
  },
});
```

---

## ⚡ How It Works & Implicit Operation

`lamba` is designed to be **100% implicit**. You don't need to refactor your codebase or replace standard environment variable accesses.

### 1. Automatic Outbound Network URL Interception (`fetch` & `XHR`)

When you override a base URL variable in `lamba` (e.g., `VITE_API_BASE_URL` from `https://api.dev.com` to `https://staging.dev.com`), `lamba` automatically intercepts all outbound network requests targeting the original base URL and redirects them live!

```typescript
// Developer writes standard code — ZERO changes required!
fetch('https://api.dev.com/v1/users')
  .then(res => res.json())
  .then(data => console.log(data));

// ⚡ Automatically redirected to https://staging.dev.com/v1/users when overridden in lamba UI!
```

### 2. Transparent Environment Wrapper (`lamba.wrap()`)

Wrap your existing `import.meta.env` (Vite) or `process.env` (Webpack/Next.js) object once:

```typescript
// src/config.ts
import lamba from '@ojolowoblue/lamba';

// Wrap your env object in a dynamic ES Proxy (preserves primitive boolean & number types!)
export const env = lamba.wrap(import.meta.env);

// Access keys anywhere in your application:
console.log(env.VITE_API_BASE_URL); // Automatically resolves live active override or default!
```

### 3. Implicit `lamba.env` & `process.env` Proxies

Access environment keys dynamically with natural object dot notation:

```typescript
// Access live environment overrides directly:
const apiBase = lamba.env.VITE_API_BASE_URL;
const isDebug = lamba.env.VITE_DEBUG_MODE;

// Programmatically set overrides via property assignment:
lamba.env.VITE_API_BASE_URL = 'https://api.staging.example.com';
```

---

## 📦 Framework Integrations

### ⚛️ React Integration

Import `useLambaEnv` from `lamba/react` to subscribe your components reactively to environment changes:

```tsx
import React from 'react';
import { useLambaEnv } from '@ojolowoblue/lamba/react';

export function UserDashboard() {
  const apiBase = useLambaEnv<string>('VITE_API_BASE_URL', 'https://api.dev.com');
  const isBetaEnabled = useLambaEnv<boolean>('VITE_FEATURE_BETA_UI', false);

  return (
    <div style={{ padding: '24px' }}>
      <h1>Dashboard</h1>
      <p>Connected Environment: <code>{apiBase}</code></p>
      
      {isBetaEnabled && (
        <div className="beta-banner">
          🚀 Beta UI Enabled Live via lamba!
        </div>
      )}
    </div>
  );
}
```

### 🟢 Vue 3 Integration

Import `useLambaEnv` from `lamba/vue` as a reactive composition Vue Ref:

```vue
<script setup lang="ts">
import { useLambaEnv } from '@ojolowoblue/lamba/vue';

const apiBase = useLambaEnv<string>('VITE_API_BASE_URL', 'https://api.dev.com');
const isNewHeader = useLambaEnv<boolean>('VITE_NEW_HEADER', false);
</script>

<template>
  <div class="container">
    <h2>Current Backend: {{ apiBase }}</h2>
    <header v-if="isNewHeader">
      <h3>✨ New Header Component</h3>
    </header>
  </div>
</template>
```

---

## 🛠️ Complete API Reference

### `lamba.init(options?: LambaOptions): LambaManager`

Initializes the lamba manager, hydrates saved overrides from the configured storage backend, enables network interceptors, and mounts the floating Shadow DOM UI.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `env` | `Record<string, any>` | `{}` | Initial default key-value pairs of environment variables (supports strings, numbers, booleans, objects). |
| `enabled` | `boolean` | `true` | Set to `false` to disable lamba (e.g. in production builds). |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Screen position for the floating widget launcher button. |
| `secretKeysPattern` | `RegExp` | `/(KEY\|SECRET\|TOKEN\|PASSWORD\|AUTH\|PRIVATE)/i` | Regular expression to automatically obscure sensitive keys in the UI. |
| `autoFetchEnvFile` | `boolean` | `false` | Whether to attempt fetching root `/.env` file during local development. |
| `interceptNetworkRequests` | `boolean` | `true` | Whether to implicitly intercept `fetch` & `XHR` calls matching original base URLs. |
| `allowedPrefixes` | `string \| string[] \| RegExp \| null` | `null` | Optional prefix filter (e.g. `['VITE_', 'NEXT_PUBLIC_']`). Omitting allows ALL keys regardless of prefix. |
| `storageStrategy` | `'local' \| 'session' \| 'memory'` | `'local'` | Where overrides and presets are persisted. See [Storage Strategies](#-storage-strategies) below. |
| `storage` | `LambaStorageAdapter` | `undefined` | Provide a fully custom storage adapter. Takes precedence over `storageStrategy`. |

---

### Core Methods

#### `lamba.get<T = any>(key: string, fallback?: T): T`
Returns the active value for the specified environment key (returns active override if present, otherwise default value or fallback). Preserves numbers, booleans, and objects.

#### `lamba.set(key: string, value: any): void`
Programmatically overrides an environment variable live at runtime with any data type. The change is persisted in the configured storage backend and triggers UI and listener updates.

#### `lamba.remove(key: string): void`
Removes an override for a specific environment variable key, reverting it to its default value.

#### `lamba.reset(): void`
Clears all active in-memory environment variable overrides, reverting all keys back to their original default values. Storage is also cleared via the configured adapter.

#### `lamba.purge(options?): void`
Wipes **all lamba data from storage** (`__lamba_overrides__`, `__lamba_presets__`, `__lamba_active_preset__`). Safe to call even when lamba has not been initialized. Use this to clean up stale data left in `localStorage` from previous sessions when disabling lamba.

```typescript
// Option A: Explicitly purge stale storage, then don't init
import lamba from '@ojolowoblue/lamba';
lamba.purge();

// Option B: Pass enabled:false — lamba auto-purges storage and mounts nothing
lamba.init({ enabled: false });

// Option C: Remove the import + call destroy() to immediately remove the floating UI at runtime
lamba.destroy();
```

> **Note**: If your `storageStrategy` was `'session'` or a custom adapter, pass the same options to `purge()` so it targets the correct backend:
> ```typescript
> lamba.purge({ storageStrategy: 'session' });
> ```

#### `lamba.onChange(listener: EnvChangeListener): () => void`
Subscribes to live environment updates. Returns an `unsubscribe` function.

```typescript
const unsubscribe = lamba.onChange((key, value, isOverridden) => {
  console.log(`Environment variable ${key} changed to ${value} (Overridden: ${isOverridden})`);
});
```

#### `lamba.wrap<T>(targetEnv: T): T`
Wraps an environment object in an ES Proxy that automatically intercepts property access to return active lamba overrides.

#### `lamba.open()` / `lamba.close()` / `lamba.toggle()`
Programmatically controls the visibility of the lamba modal panel.

#### `lamba.destroy(): void`
Fully tears down lamba at runtime: removes the `<lamba-widget>` shadow host from the DOM, disables the network interceptor, and resets all internal state. After calling `destroy()`, `init()` can be safely called again to re-mount.

Useful for:
- **React/Vue cleanup hooks** — call `lamba.destroy()` in a `useEffect` or `onUnmounted` teardown.
- **Conditional disabling at runtime** — toggle lamba off without a page reload.
- **HMR (automatic)** — in Vite/webpack dev environments, lamba automatically calls `destroy()` via `import.meta.hot.dispose` when the module is hot-replaced or removed, so the floating button disappears immediately when you delete the `lamba.init()` call.

```typescript
// Manual teardown example (e.g. in a React cleanup effect)
import lamba from '@ojolowoblue/lamba';

useEffect(() => {
  lamba.init();
  return () => lamba.destroy(); // Removes the floating button when component unmounts
}, []);
```

---

## 🔐 Storage Strategies

Control where lamba persists overrides and presets via the `storageStrategy` option:

| Strategy | Visibility in DevTools | Survives Tab Close? | XSS Storage Scraping Risk |
| :--- | :--- | :--- | :--- |
| `'local'` *(default)* | ⚠️ Visible (plain-text) | ✅ Yes (Indefinitely) | ⚠️ Yes |
| `'session'` | ⚠️ Visible (plain-text) | ❌ No (Cleared on close) | ⚠️ Yes |
| `'memory'` | ✅ **Not visible (0 bytes stored)** | ❌ No (GC'd on close) | ✅ **No** |

### In-Memory (Most Secure)

```typescript
lamba.init({
  storageStrategy: 'memory', // Nothing written to DevTools Storage
  env: { VITE_API_URL: import.meta.env.VITE_API_URL },
});
```

### Session (Tab-Ephemeral)

```typescript
lamba.init({
  storageStrategy: 'session', // Cleared automatically when tab closes
  env: { VITE_API_URL: import.meta.env.VITE_API_URL },
});
```

### Custom Adapter

Implement the `LambaStorageAdapter` interface to plug in any storage backend (encrypted storage, Electron keytar, IndexedDB, etc.):

```typescript
import lamba, { type LambaStorageAdapter } from '@ojolowoblue/lamba';

// Example: an encrypted wrapper around sessionStorage
const encryptedAdapter: LambaStorageAdapter = {
  getItem: (key) => decrypt(sessionStorage.getItem(key)),
  setItem: (key, value) => sessionStorage.setItem(key, encrypt(value)),
  removeItem: (key) => sessionStorage.removeItem(key),
  clear: () => sessionStorage.clear(),
};

lamba.init({
  storage: encryptedAdapter,
  env: { VITE_API_URL: import.meta.env.VITE_API_URL },
});
```

---

## 🔒 Production Security Best Practice

To prevent end-users from overriding environment variables in production, conditionally initialize `lamba` only in non-production environments:

```typescript
import lamba from '@ojolowoblue/lamba';

lamba.init({
  enabled: process.env.NODE_ENV !== 'production',
  storageStrategy: 'memory', // Use memory storage so nothing lingers in DevTools
  env: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  },
});
```

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><b>Does lamba modify my local <code>.env</code> files on disk?</b></summary>
<p>No. <code>lamba</code> operates entirely in browser memory and optionally persists overrides in storage. It does not write to disk, so your git status remains clean.</p>
</details>

<details>
<summary><b>Do overrides persist when I refresh the page?</b></summary>
<p>It depends on the <code>storageStrategy</code>. With <code>'local'</code> (default), overrides persist indefinitely. With <code>'session'</code>, they survive reloads but clear when the tab is closed. With <code>'memory'</code>, overrides are lost on any page reload.</p>
</details>

<details>
<summary><b>Will lamba CSS affect my web application styles?</b></summary>
<p>No. All <code>lamba</code> UI components and styles are rendered inside a modern <b>Shadow DOM host element</b> (<code>&lt;lamba-widget&gt;</code>), guaranteeing 100% style isolation.</p>
</details>

<details>
<summary><b>I removed the <code>lamba.init()</code> call but the floating button is still visible — why?</b></summary>
<p>The <code>&lt;lamba-widget&gt;</code> element is appended to <code>document.body</code> at init time and isn't automatically removed on module removal. To clean it up:</p>
<ul>
  <li><b>In a Vite/webpack dev project</b>: lamba registers a <code>import.meta.hot.dispose</code> hook that calls <code>lamba.destroy()</code> automatically on HMR — the button will disappear as soon as you save the file with the import removed.</li>
  <li><b>If it still persists</b>: Call <code>lamba.destroy()</code> explicitly before removing the import, or do a hard page reload (<kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>) to clear the DOM.</li>
</ul>
</details>

---

## 📄 License

MIT License © 2026
