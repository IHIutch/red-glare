import context from 'virtual:starsandstripes/context'

/**
 * Expose the Astro config fields the link validator cares about via
 * the virtual `virtual:starsandstripes/context` module, which the
 * integration's Vite plugin populates at `astro:config:setup` time.
 * Going through the virtual module means the JSON is baked into the
 * prerender chunk at build time, so both the integration side and
 * the route's hoisted `getStaticPaths` scope read the same values —
 * runtime module state doesn't flow between those scopes.
 *
 * - `site` is the absolute origin the site will be served from
 *   (`https://example.gov`). Used to recognize fully-qualified
 *   self-referential links as internal. Trailing slash stripped for
 *   easier prefix matching.
 * - `base` is the URL path prefix, normalized to `/` or `/…/`
 *   (never bare). A `base` of `/docs` means absolute-path links
 *   in markdown should be written `/docs/components/`, and the
 *   validator strips that prefix before looking up the slug.
 */
interface BuildConfig {
  site?: string
  base: string
}

const TRAILING_SLASHES_RE = /\/+$/

export function getBuildConfig(): BuildConfig {
  return {
    site: context.site?.replace(TRAILING_SLASHES_RE, ''),
    base: normalizeBase(context.base ?? '/'),
  }
}

function normalizeBase(base: string): string {
  const withLead = base.startsWith('/') ? base : `/${base}`
  const withoutTrail = withLead.replace(TRAILING_SLASHES_RE, '')
  return withoutTrail === '' ? '/' : `${withoutTrail}/`
}
