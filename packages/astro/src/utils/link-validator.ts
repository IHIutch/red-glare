import type { ComarkTree } from 'comark'

import { getPageMeta } from '../comark.js'

export interface ValidatorDoc {
  /**
   * URL-path segment the docs loader assigned to this entry
   * (e.g. `getting-started`, `components`, or `index`).
   */
  slug: string
  tree: ComarkTree
}

export interface LinkValidatorOptions {
  /**
   * Throw on any broken link. When false, errors are still reported
   * via the supplied logger but the build is allowed to continue.
   * @default true
   */
  strict?: boolean
  /**
   * Additional hrefs to treat as valid regardless of whether they
   * resolve — one entry per link. Useful for dynamic redirects or
   * anchors injected at runtime. Supports exact matches only.
   */
  ignore?: string[]
  /**
   * The site's absolute origin (Astro's `site` config, e.g.
   * `https://example.gov`). When set, links that begin with this
   * origin are treated as internal — the origin is stripped and the
   * remaining path goes through the same slug lookup as any other
   * absolute-path link. Trailing slash on the origin is normalized.
   */
  site?: string
  /**
   * URL base path the site is served from (Astro's `base` config,
   * normalized as `/` or `/…/`). Absolute-path links are expected
   * to include this prefix; the validator strips it before the
   * slug lookup so `/docs/components/` resolves to the slug
   * `components` when `base === '/docs/'`.
   * @default '/'
   */
  base?: string
}

export interface BrokenLink {
  sourceSlug: string
  href: string
  reason: string
}

interface LinkValidatorReport {
  broken: BrokenLink[]
  checked: number
}

const EXTERNAL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i
const PROTOCOL_SKIP_RE = /^(?:mailto:|tel:|sms:|javascript:|data:|blob:)/i
const TRAILING_SLASH_RE = /\/+$/
const LEADING_SLASH_RE = /^\/+/

/**
 * Validate internal links across a set of parsed doc trees.
 *
 * The walker in `comark.ts` already collects, per tree:
 *   - `tree.meta.pageIds` — every element id that will be rendered on
 *     that page (every heading, plus any author-set `id=` attr).
 *   - `tree.meta.links` — every `<a href>` value, in document order.
 *
 * This function cross-references each link against the per-slug id
 * set + the global slug set:
 *
 *   - Fragment-only (`#foo`) → must exist in the source page's
 *     `pageIds`.
 *   - Absolute path (`/foo/` or `/foo/#bar`) → path must resolve to
 *     a known slug; optional `#bar` anchor must be in that slug's
 *     `pageIds`.
 *   - External (`http://`, `mailto:`, etc.) → skipped.
 *   - Relative (`./other`, `other.md`) → skipped; docs should use
 *     absolute paths, and resolving relative paths requires a base
 *     that our `getCollection()` flow doesn't expose.
 *
 * Returns the full report even in strict mode; the caller decides
 * whether to `throw` after logging.
 */
export function validateLinks(
  docs: ValidatorDoc[],
  options: LinkValidatorOptions = {},
): LinkValidatorReport {
  const ignore = new Set(options.ignore ?? [])
  const site = options.site?.replace(TRAILING_SLASH_RE, '') ?? undefined
  const base = normalizeBase(options.base ?? '/')

  const slugToIds = new Map<string, Set<string>>()
  for (const doc of docs) {
    slugToIds.set(doc.slug, getPageMeta(doc.tree).pageIds)
  }

  const broken: BrokenLink[] = []
  let checked = 0

  for (const doc of docs) {
    const { links, pageIds } = getPageMeta(doc.tree)
    for (const rawHref of links) {
      const href = rawHref.trim()
      if (!href || href === '#')
        continue
      if (ignore.has(href))
        continue

      // Fully-qualified self-referential URL: strip the origin and
      // fall through to the absolute-path branch so it's validated
      // like any other internal link.
      let normalized = href
      if (site && normalized.startsWith(`${site}/`)) {
        normalized = normalized.slice(site.length) || '/'
      }
      else if (site && normalized === site) {
        normalized = '/'
      }

      if (EXTERNAL_RE.test(normalized) && !normalized.startsWith('/'))
        continue
      if (PROTOCOL_SKIP_RE.test(normalized))
        continue

      checked++

      if (normalized.startsWith('#')) {
        const anchor = normalized.slice(1)
        if (!pageIds.has(anchor)) {
          broken.push({
            sourceSlug: doc.slug,
            href,
            reason: `no element with id="${anchor}" on this page`,
          })
        }
        continue
      }

      if (normalized.startsWith('/')) {
        const [rawPath, rawAnchor] = splitHashOnce(normalized)
        const baseStripped = stripBase(rawPath, base)
        if (baseStripped === null) {
          broken.push({
            sourceSlug: doc.slug,
            href,
            reason: `path "${rawPath}" is outside the configured base "${base}"`,
          })
          continue
        }
        const targetSlug = normalizePathToSlug(baseStripped)
        if (!slugToIds.has(targetSlug)) {
          broken.push({
            sourceSlug: doc.slug,
            href,
            reason: `no docs entry resolves to path "${rawPath}"`,
          })
          continue
        }
        if (rawAnchor && !slugToIds.get(targetSlug)!.has(rawAnchor)) {
          broken.push({
            sourceSlug: doc.slug,
            href,
            reason: `page "${targetSlug}" has no element with id="${rawAnchor}"`,
          })
        }
        continue
      }

      // Relative path — skip in v1.
    }
  }

  return { broken, checked }
}

function splitHashOnce(href: string): [string, string | null] {
  const idx = href.indexOf('#')
  if (idx < 0)
    return [href, null]
  return [href.slice(0, idx), href.slice(idx + 1)]
}

/**
 * Normalize a user-supplied `base` to the Astro canonical form
 * (leading slash, trailing slash, `/` for "no base"). Mirrors the
 * normalization `build-config.ts` does when it reads the resolved
 * Astro config, so callers who pass a raw string end up at the
 * same place.
 */
function normalizeBase(base: string): string {
  const withLead = base.startsWith('/') ? base : `/${base}`
  const withoutTrail = withLead.replace(TRAILING_SLASH_RE, '')
  return withoutTrail === '' ? '/' : `${withoutTrail}/`
}

/**
 * Strip Astro's `base` prefix from an absolute-path link. Returns:
 *   - the path with the prefix removed (keeping the leading slash)
 *     on success,
 *   - the original path when `base === '/'` (no prefix to strip),
 *   - `null` when the link starts with `/` but doesn't begin with
 *     the configured base — the docs author linked to something
 *     outside the configured subpath, which is almost always a bug.
 */
function stripBase(path: string, base: string): string | null {
  if (base === '/')
    return path
  const withoutTrailing = base.replace(TRAILING_SLASH_RE, '')
  if (path === withoutTrailing || path === base)
    return '/'
  if (path.startsWith(base))
    return `/${path.slice(base.length)}`
  return null
}

/**
 * Convert a URL path like `/components/` or `/getting-started/#foo`
 * into the docs-loader slug that would render there. Strips the
 * leading slash, any trailing slash, and the `#anchor` suffix. The
 * homepage (`/`) maps to the `index` slug that our loader uses.
 */
function normalizePathToSlug(path: string): string {
  const trimmed = path.replace(TRAILING_SLASH_RE, '').replace(LEADING_SLASH_RE, '')
  return trimmed === '' ? 'index' : trimmed
}
