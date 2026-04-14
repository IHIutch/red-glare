declare module 'virtual:red-glare/config' {
  const config: import('./config').RedGlareConfig
  export default config
}

declare module 'virtual:red-glare/context' {
  const context: {
    root: string
    trailingSlash: string
    site: string | undefined
    base: string
  }
  export default context
}

// Fontsource packages are CSS-only and have no TypeScript declarations.
// Side-effect imports load the @font-face declarations and bundled woff2
// files via Vite's CSS pipeline. Wildcard ambient modules cover both the
// static (`@fontsource/*`) and variable (`@fontsource-variable/*`) lines.
declare module '@fontsource/*';
declare module '@fontsource-variable/*';
