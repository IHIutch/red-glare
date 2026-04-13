import type { ComarkElement, ComarkNode, ComarkTree } from 'comark'

import { extractText } from './text.js'

/**
 * TOC heading shape. Kept structurally identical to Astro's
 * `MarkdownHeading` (`@astrojs/markdown-remark`) so consumers that
 * expect the Astro contract — Starlight, pagefind adapters,
 * third-party TOC components — can drop our output in without
 * reshaping. We intentionally duplicate the interface rather than
 * importing `MarkdownHeading` because `@astrojs/markdown-remark` is
 * a transitive dep of `astro` itself, not a direct dep we should
 * be reaching into.
 */
export interface Heading {
  depth: number
  slug: string
  text: string
}

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

/**
 * Recursively walk a Comark tree and collect every `<h1>`–`<h6>` in
 * document order — including ones nested inside custom components
 * like `<Alert>` or `<AccordionItem>` (authors author them via
 * `:::alert-heading` / `:::accordion-heading` slots, where the inner
 * content is real markdown headings). Depth comes from the tag,
 * slug from `attrs.id` (populated upstream by `attachTocHeadings`
 * via `github-slugger` for any heading that didn't already have an
 * id), text from recursively extracted text content.
 */
export function extractHeadings(tree: ComarkTree): Heading[] {
  const headings: Heading[] = []
  walk(tree.nodes, headings)
  return headings
}

function walk(nodes: ComarkNode[], out: Heading[]): void {
  for (const node of nodes) {
    if (!Array.isArray(node))
      continue
    if (node[0] === null)
      continue

    const [tag, attrs, ...children] = node as ComarkElement
    const tagName = typeof tag === 'string' ? tag : ''

    if (HEADING_TAGS.has(tagName)) {
      out.push({
        depth: Number(tagName.slice(1)),
        slug: ((attrs as Record<string, unknown>)?.id as string) ?? '',
        text: extractText(node as ComarkElement),
      })
    }

    walk(children as ComarkNode[], out)
  }
}
