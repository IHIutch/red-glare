import type { ComarkNode, ComarkTree } from 'comark'

import githubDark from '@shikijs/themes/github-dark'
import githubLight from '@shikijs/themes/github-light'
import { parse } from 'comark'
import highlight from 'comark/plugins/highlight'
import summary from 'comark/plugins/summary'

import { nodesToPlainText, truncate } from './utils/text.js'

export type { ComarkTree }

/**
 * Parse markdown content into a Comark AST with configured plugins.
 *
 * The AST is then rendered by @comark/react's ComarkRenderer in Astro
 * routes, with custom USWDS component mappings passed via the `components`
 * prop.
 */
export async function parseContent(markdown: string): Promise<ComarkTree> {
  return parse(markdown, {
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
      }),
      // Authors mark a "summary cut" by inserting `<!-- more -->` in their
      // markdown. The plugin populates `tree.meta.summary` with the nodes
      // before the delimiter; we consume it for SEO/RSS description fallbacks.
      summary(),
    ],
  })
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
