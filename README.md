# lamba ⚡

**`lamba`** is a universal, lightweight developer tool and browser widget for viewing, overriding, and swapping environment variables live in web applications (React, Vue, Next.js, Vite, Astro, Svelte, or Vanilla HTML/JS)—**without touching source code, restarting dev servers, or editing `.env` files.**

Deployed via CDN or installed via NPM, `lamba` injects a non-intrusive floating UI powered by **Shadow DOM encapsulation**. Devs, QA engineers, and project managers can test multiple API environments, toggle feature flags, switch authentication tokens, and swap backend clusters on the fly directly in the browser.

---

## 🌟 Key Features

- ⚡ **Zero-Setup CDN & NPM Support**: Add a single `<script>` tag or install via NPM/Yarn/PNPM.
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
<script src="https://unpkg.com/lamba"></script>
```

That's it! A floating settings button (⚙️) will automatically appear in the bottom-right corner of your web page.

### Option 2: NPM / Package Manager

Install `lamba` in your project:

```bash
npm install lamba
# or
yarn add lamba
# or
pnpm add lamba
```

Initialize `lamba` in your application entrypoint (`src/main.ts` or `src/index.js`):

```typescript
import lamba from 'lamba';

lamba.init({
  position: 'bottom-right',
  env: {
    VITE_API_BASE_URL: 'https://api.dev.example.com',
    VITE_FEATURE_NEW_CHECKOUT: 'false',
    VITE_ENABLE_ANALYTICS: 'true',
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
import lamba from 'lamba';

// Wrap your env object in a dynamic ES Proxy
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
import { useLambaEnv } from 'lamba/react';

export function UserDashboard() {
  const apiBase = useLambaEnv('VITE_API_BASE_URL', 'https://api.dev.com');
  const showBetaFeature = useLambaEnv('VITE_FEATURE_BETA_UI', 'false');

  return (
    <div style={{ padding: '24px' }}>
      <h1>Dashboard</h1>
      <p>Connected Environment: <code>{apiBase}</code></p>
      
      {showBetaFeature === 'true' && (
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
import { useLambaEnv } from 'lamba/vue';

const apiBase = useLambaEnv('VITE_API_BASE_URL', 'https://api.dev.com');
const featureFlag = useLambaEnv('VITE_NEW_HEADER', 'false');
</script>

<template>
  <div class="container">
    <h2>Current Backend: {{ apiBase }}</h2>
    <header v-if="featureFlag === 'true'">
      <h3>✨ New Header Component</h3>
    </header>
  </div>
</template>
```

---

## 🛠️ Complete API Reference

### `lamba.init(options?: LambaOptions): LambaManager`

Initializes the lamba manager, hydrates saved overrides from `localStorage`, enables network interceptors, and mounts the floating Shadow DOM UI.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `env` | `Record<string, string>` | `{}` | Initial default key-value pairs of environment variables. |
| `enabled` | `boolean` | `true` | Set to `false` to disable lamba (e.g. in production builds). |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Screen position for the floating widget launcher button. |
| `secretKeysPattern` | `RegExp` | `/(KEY\|SECRET\|TOKEN\|PASSWORD\|AUTH\|PRIVATE)/i` | Regular expression to automatically obscure sensitive keys in the UI. |
| `autoFetchEnvFile` | `boolean` | `false` | Whether to attempt fetching root `/.env` file during local development. |
| `interceptNetworkRequests` | `boolean` | `true` | Whether to implicitly intercept `fetch` & `XHR` calls matching original base URLs. |

---

### Core Methods

#### `lamba.get(key: string, fallback?: string): string`
Returns the active value for the specified environment key (returns active override if present, otherwise default value or fallback).

#### `lamba.set(key: string, value: string): void`
Programmatically overrides an environment variable live at runtime. The change is persisted in `localStorage` and triggers UI and listener updates.

#### `lamba.remove(key: string): void`
Removes an override for a specific environment variable key, reverting it to its default value.

#### `lamba.reset(): void`
Clears all active environment overrides, reverting all keys back to their original default values.

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

---

## 🔒 Production Security Best Practice

To prevent end-users from overriding environment variables in production, conditionally initialize `lamba` only in non-production environments:

```typescript
import lamba from 'lamba';

lamba.init({
  enabled: process.env.NODE_ENV !== 'production',
  env: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  },
});
```

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><b>Does lamba modify my local <code>.env</code> files on disk?</b></summary>
<p>No. <code>lamba</code> operates entirely in browser memory and persists overrides in <code>localStorage</code>. It does not write to disk, so your git status remains clean.</p>
</details>

<details>
<summary><b>Do overrides persist when I refresh the page?</b></summary>
<p>Yes. Overrides and active preset profiles are saved in <code>localStorage</code> and automatically restored upon page reloads.</p>
</details>

<details>
<summary><b>Will lamba CSS affect my web application styles?</b></summary>
<p>No. All <code>lamba</code> UI components and styles are rendered inside a modern <b>Shadow DOM host element</b> (<code>&lt;lamba-widget&gt;</code>), guaranteeing 100% style isolation.</p>
</details>

---

## 📄 License

MIT License © 2026
