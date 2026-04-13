import type { ComarkTree } from 'comark'

/**
 * Build-time cache of parsed Comark trees keyed by docs entry id.
 *
 * Lives in its own module because Astro hoists `getStaticPaths` into
 * a separate evaluation scope during the build — a cache declared in
 * a route's frontmatter is invisible to `getStaticPaths` and vice
 * versa. A shared utility module sits in both scopes' import graph,
 * so the population path (in `getStaticPaths`, once per build) and
 * the read path (in each page's frontmatter) observe the same Map.
 *
 * Cleared implicitly when the build process exits; tests reset it
 * manually via `clearTreeCache()`.
 */
const treeCache = new Map<string, ComarkTree>()

export function setCachedTree(id: string, tree: ComarkTree): void {
  treeCache.set(id, tree)
}

export function getCachedTree(id: string): ComarkTree | undefined {
  return treeCache.get(id)
}

export function clearTreeCache(): void {
  treeCache.clear()
}
