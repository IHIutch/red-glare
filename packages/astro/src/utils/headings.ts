import type { ComarkElement, ComarkTree } from 'comark'

import { extractText } from './text.js'

export interface Heading {
  depth: number
  slug: string
  text: string
}

/**
 * Extract h2 and h3 headings from a Comark AST for table of contents.
 */
export function extractHeadings(tree: ComarkTree): Heading[] {
  const headings: Heading[] = []

  for (const node of tree.nodes) {
    if (!Array.isArray(node))
      continue
    const [tag, attrs] = node as ComarkElement
    if (tag !== 'h2' && tag !== 'h3')
      continue

    const depth = tag === 'h2' ? 2 : 3
    const slug = (attrs?.id as string) ?? ''
    const text = extractText(node as ComarkElement)

    if (text) {
      headings.push({ depth, slug, text })
    }
  }

  return headings
}
