import type { ComarkNode, ComarkTree } from 'comark'

import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'
import { parse } from 'comark'
import highlight from 'comark/plugins/highlight'
import summary from 'comark/plugins/summary'
import GithubSlugger from 'github-slugger'

// Extra languages preloaded on top of comark's defaults (vue, tsx, svelte,
// typescript, javascript, mdc, bash, json, yaml, astro). Anything a docs
// author is likely to fence goes here — CSS/Sass flavours, config file
// formats (jsonc, toml, ini, dockerfile), common markup, and a handful of
// popular programming languages. Aliases (e.g. `sh`, `md`, `py`, `ts`, `js`)
// resolve automatically via Shiki once the parent language is registered.
import css from 'shiki/dist/langs/css.mjs'
import dockerfile from 'shiki/dist/langs/dockerfile.mjs'
import go from 'shiki/dist/langs/go.mjs'
import html from 'shiki/dist/langs/html.mjs'
import ini from 'shiki/dist/langs/ini.mjs'
import jsonc from 'shiki/dist/langs/jsonc.mjs'
import python from 'shiki/dist/langs/python.mjs'
import rust from 'shiki/dist/langs/rust.mjs'
import sass from 'shiki/dist/langs/sass.mjs'
import scss from 'shiki/dist/langs/scss.mjs'
import shellscript from 'shiki/dist/langs/shellscript.mjs'
import sql from 'shiki/dist/langs/sql.mjs'
import toml from 'shiki/dist/langs/toml.mjs'
import xml from 'shiki/dist/langs/xml.mjs'

import bodySlot from './comark-plugins/body-slot'
import endpoint from './comark-plugins/endpoint'
import { resolveIconByName } from './components/icons'
import { getLangIcon } from './components/lang-icons'
import { extractText, nodesToPlainText, truncate } from './utils/text'

const HEADING_TAG_RE = /^h[1-6]$/

/**
 * Extra metadata the link validator reads off each parsed tree.
 * `parseContent` populates these as side effects of the slug walker:
 *
 * - `pageIds` is every element `id` we'll emit on this page — real
 *   heading ids (backfilled by `attachTocHeadings`) plus any `id=`
 *   attribute an author set manually. `#anchor` link targets on this
 *   page must exist in this set.
 * - `links` is every `<a href>` value seen in the tree, in document
 *   order. The cross-doc validator resolves each one against the
 *   full set of known page slugs + per-page `pageIds`.
 */
export interface ComarkPageMeta {
  pageIds: Set<string>
  links: string[]
}

export function getPageMeta(tree: ComarkTree): ComarkPageMeta {
  const meta = (tree.meta ?? {}) as Record<string, unknown>
  return {
    pageIds: (meta.pageIds as Set<string> | undefined) ?? new Set(),
    links: (meta.links as string[] | undefined) ?? [],
  }
}

export type { ComarkTree }

/**
 * Walk the Comark tree and attach pre-resolved icon data to nodes that
 * need it:
 *
 *   - `code-group` children (`pre` nodes with a `filename` attr) get an
 *     `iconData` attr derived from the filename via `getLangIcon`.
 *   - `tabs-item` nodes with an `icon="i-{set}-{name}"` attr get an
 *     `iconData` attr derived via `resolveIconByName`.
 *
 * This keeps the Iconify JSON imports on the server side. The rendered
 * components (`CodeGroup`, `Tabs`) read `iconData` straight from props
 * and never call the resolvers themselves, so the 11 MB of icon data
 * doesn't end up in the client hydration bundle.
 */
function attachIconData(nodes: ComarkNode[]): void {
  for (const node of nodes) {
    if (!Array.isArray(node))
      continue
    if (node[0] === null)
      continue

    const tag = node[0]
    const attrs = node[1] as Record<string, unknown>
    const children = node.slice(2) as ComarkNode[]

    if (tag === 'code-group') {
      for (const child of children) {
        if (Array.isArray(child) && child[0] === 'pre') {
          const childAttrs = child[1] as Record<string, unknown>
          const filename = childAttrs?.filename
          if (typeof filename === 'string') {
            const icon = getLangIcon(filename)
            if (icon)
              childAttrs.iconData = icon
          }
        }
      }
    }
    else if (tag === 'tabs-item') {
      const icon = attrs?.icon
      if (typeof icon === 'string') {
        const resolved = resolveIconByName(icon)
        if (resolved)
          attrs.iconData = resolved
      }
    }

    attachIconData(children)
  }
}

/**
 * Walk the Comark tree and attach `tocHeading` markers to component
 * nodes whose rendered output anchors the document outline:
 *
 *   - `alert` nodes with both `title` and `level` set (level is
 *     normalized through the same path as the component, so strings
 *     like `"3"` from directive attrs are accepted).
 *   - `accordion-item` nodes whose parent `accordion` has a `level`
 *     attr. Level comes from the parent's context, not the item.
 *
 * `extractHeadings` picks them up via its normal recursive walk —
 * no synthetic heading attrs for components needed, because authors
 * write real markdown headings inside the `#heading` named slot of
 * each parent directive (alert, accordion-item, summary-box,
 * process-list-item) and those are just `h1`–`h6` nodes in the tree.
 * Slugs come from `github-slugger`, the same library Astro's markdown
 * pipeline uses, so internal links agree with Astro's own heading ids.
 */
function attachTocHeadings(
  nodes: ComarkNode[],
  slugger: GithubSlugger,
  pageIds: Set<string>,
  links: string[],
): void {
  for (const node of nodes) {
    if (!Array.isArray(node))
      continue
    if (node[0] === null)
      continue

    const tag = node[0]
    const attrs = node[1] as Record<string, unknown>
    const children = node.slice(2) as ComarkNode[]

    if (typeof tag === 'string' && HEADING_TAG_RE.test(tag)) {
      const text = extractText(node)
      if (text) {
        const existing = attrs?.id
        if (typeof existing === 'string' && existing) {
          slugger.slug(existing)
          pageIds.add(existing)
        }
        else {
          const slug = slugger.slug(text)
          attrs.id = slug
          pageIds.add(slug)
        }
      }
    }
    else {
      const existingId = attrs?.id
      if (typeof existingId === 'string' && existingId)
        pageIds.add(existingId)
    }

    if (tag === 'a') {
      const href = attrs?.href
      if (typeof href === 'string' && href)
        links.push(href)
    }

    attachTocHeadings(children, slugger, pageIds, links)
  }
}

/**
 * Parse markdown content into a Comark AST with configured plugins.
 *
 * The AST is then rendered by @comark/react's ComarkRenderer in Astro
 * routes, with custom USWDS component mappings passed via the `components`
 * prop.
 *
 * Accepts `undefined` for frontmatter-only pages — Astro's content
 * collection returns `body: undefined` when a `.md` file has no body
 * after the closing `---`, and comark's internal `parseFrontmatter`
 * calls `.startsWith` on its argument unconditionally.
 */
export async function parseContent(markdown: string | undefined): Promise<ComarkTree> {
  const tree = await parse(markdown ?? '', {
    plugins: [
      highlight({
        // Themes must be passed as preloaded ThemeRegistration objects, not
        // string identifiers — comark's highlight plugin only knows how to
        // dynamically import its built-in defaults (the Material themes), so
        // any other theme has to arrive as the actual loaded theme data.
        themes: {
          light: githubLight,
          dark: githubDark,
        },
        languages: [
          css,
          dockerfile,
          go,
          html,
          ini,
          jsonc,
          python,
          rust,
          sass,
          scss,
          shellscript,
          sql,
          toml,
          xml,
        ],
      }),
      // Authors mark a "summary cut" by inserting `<!-- more -->` in their
      // markdown. The plugin populates `tree.meta.summary` with the nodes
      // before the delimiter; we consume it for SEO/RSS description fallbacks.
      summary(),
      // Aliases the `#body` named slot to comark's built-in `#default`
      // slot — see comark-plugins/body-slot.ts
      bodySlot(),
      // Validates `:::endpoint` YAML attributes (method, path, parameters,
      // responses, etc.) at parse time — see comark-plugins/endpoint.ts
      endpoint(),
    ],
  })
  attachIconData(tree.nodes)

  const pageIds = new Set<string>()
  const links: string[] = []
  attachTocHeadings(tree.nodes, new GithubSlugger(), pageIds, links)
  tree.meta = { ...tree.meta, pageIds, links }

  return tree
}

/**
 * Extract plain text from `tree.meta.summary` for use in meta descriptions
 * (SEO `description`, OpenGraph, RSS item description). Skips the leading
 * H1 if present, since it duplicates the page title in the same surface.
 *
 * Returns null when the document doesn't define a summary cut. The result
 * is truncated to `maxLength` (default 160, the SEO sweet spot) on a word
 * boundary with an ellipsis if needed.
 */
export function extractSummaryText(
  tree: ComarkTree,
  maxLength = 160,
): string | null {
  const nodes = tree.meta?.summary as ComarkNode[] | undefined
  if (!nodes || nodes.length === 0)
    return null
  // Drop a leading H1 — it's the article title, already in <title>/og:title
  const filtered = nodes.filter((node, i) => {
    if (i !== 0)
      return true
    if (!Array.isArray(node))
      return true
    return node[0] !== 'h1'
  })
  const text = nodesToPlainText(filtered)
  if (!text)
    return null
  return truncate(text, maxLength)
}
