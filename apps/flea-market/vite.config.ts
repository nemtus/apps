/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // @nemtus/symbol-sdk v3 does Ed25519 in a Rust WASM module. Its default
    // `symbol-crypto-wasm-node` loader reads the .wasm off disk via fs/path, which
    // does not exist in the browser — so touching SymbolFacade/KeyPair would break
    // at runtime (the build stays green because node polyfills stub `fs`). Enable
    // async WASM and alias the loader to the fetch/ESM web build (see
    // resolve.alias + optimizeDeps.exclude below). The top-level await this needs
    // ships as-is: build.target is esnext, so no transform plugin is required.
    wasm(),
    // The Symbol SDK also relies on Node builtins/globals (Buffer, crypto, stream,
    // process) in the browser — the equivalent of the old config-override.js.
    nodePolyfills({
      globals: { Buffer: true, global: true, process: true },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // Swap the Node WASM loader for the browser (fetch/ESM) build.
      'symbol-crypto-wasm-node': 'symbol-crypto-wasm-web/symbol_crypto_wasm.js',
    },
  },
  optimizeDeps: {
    // esbuild dep pre-bundling (dev) chokes on `import "*.wasm"`; exclude it.
    exclude: ['symbol-crypto-wasm-web'],
  },
  // Keep the REACT_APP_ prefix so the existing .env / .env.testnet / .env.mainnet
  // files work unchanged. Vars are exposed via import.meta.env.REACT_APP_*.
  envPrefix: 'REACT_APP_',
  build: {
    // Firebase Hosting serves ./build (see firebase.json hosting.public).
    outDir: 'build',
    // Top-level await (Symbol WASM init) needs a modern target; it cannot be
    // down-levelled to the default baseline, and esnext lets it ship natively.
    target: 'esnext',
  },
  server: {
    port: 3000,
  },
  test: {
    // The backend Worker (apps/flea-market/worker) has its own node-environment
    // vitest (run by ci-core); its node:sqlite tests must not be pulled into this
    // app's jsdom run.
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', 'worker/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
