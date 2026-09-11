import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM, CJS, and TypeScript declarations
  {
    entry: ['src/index.ts', 'src/integrations/react.ts', 'src/integrations/vue.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    external: ['react', 'vue'],
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    injectStyle: true,
  },
  // Standalone UMD / IIFE CDN bundle (for unpkg.com)
  {
    entry: { 'lamba.min': 'src/index.ts' },
    format: ['iife'],
    globalName: 'lamba',
    minify: true,
    sourcemap: false,
    injectStyle: true,
    outExtension() {
      return { js: '.js' };
    },
  },
]);
