// Red Glare uses Astro's built-in glob() loader for content discovery.
// Comark parsing happens at render time in the route, not at load time.
// This file re-exports the glob loader with docs-specific defaults.

import { glob } from 'astro/loaders'

/**
 * Content collection loader for Red Glare docs.
 * Wraps Astro's glob loader with sensible defaults for the docs directory.
 */
export function docsLoader(options?: { base?: string, pattern?: string }) {
  return glob({
    pattern: options?.pattern ?? '**/*.md',
    base: options?.base ?? './src/content/docs',
  })
}
