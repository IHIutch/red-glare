import type { ComarkElement, ComarkNode } from 'comark'

/**
 * Recursively extract plain text from a Comark node, dropping all formatting.
 * Strings are returned as-is; element children are concatenated.
 */
export function extractText(node: ComarkNode): string {
  if (typeof node === 'string')
    return node
  if (!Array.isArray(node))
    return ''
  // Skip tag and attrs, walk children
  const [, , ...children] = node as ComarkElement
  return children.map(extractText).join('')
}

/**
 * Concatenate plain text from a list of nodes with spaces, collapsing
 * runs of whitespace and trimming. Suitable for meta description / RSS
 * description content.
 */
export function nodesToPlainText(nodes: ComarkNode[]): string {
  return nodes
    .map(extractText)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Truncate a string to a maximum length on a word boundary, appending
 * an ellipsis if truncated. Used for capping meta description fields.
 */
export function truncate(text: string, maxLength = 160): string {
  if (text.length <= maxLength)
    return text
  const slice = text.slice(0, maxLength - 1)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice
  return `${cut}\u2026`
}
