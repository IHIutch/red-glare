import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Astro's preact integration wires these aliases in production so
  // `react`/`react-dom` imports resolve to `preact/compat`. Vitest runs
  // outside the Astro pipeline, so we re-register them here to keep the
  // test environment in sync with what ships.
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact',
  },
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/client': 'preact/compat/client',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  optimizeDeps: {
    // Vite's default dep crawler ignores `__tests__` directories, so any
    // dep imported only from a test file (react-dom/server, @uswds/uswds/*,
    // etc.) gets discovered lazily mid-run — triggering a Vite reload that
    // breaks the in-flight test. Pointing `entries` at the test files makes
    // Vite scan them at startup so everything is pre-optimized up front.
    entries: ['src/**/*.test.ts'],
  },
  test: {
    include: ['src/**/*.test.ts'],
    browser: {
      provider: playwright(),
      headless: true,
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})
