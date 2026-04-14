import type { APIContext } from 'astro'

// Auto-generated llms.txt — a markdown index of all docs for AI tools.
// Follows the llmstxt.org spec. Injected conditionally when config.llms
// is true. Each entry links to the raw .md file for the page.
import { getCollection } from 'astro:content'

import type { DocsEntry } from '../schema'

const TRAILING_SLASH_RE = /\/$/

export async function GET(context: APIContext) {
  const { default: config } = await import('virtual:starsandstripes/config')

  // getCollection returns `any` inside integration packages — Astro's
  // collection types are codegen'd in the user project, not the library.
  const docs = (await getCollection(
    'docs',
    (entry: DocsEntry) => !entry.data.draft,
  )) as DocsEntry[]

  const siteUrl = context.site?.toString().replace(TRAILING_SLASH_RE, '') ?? ''

  const lines: string[] = [
    `# ${config.title}`,
    '',
  ]

  if (config.description) {
    lines.push(`> ${config.description}`, '')
  }

  lines.push('## Docs', '')

  for (const doc of docs) {
    const slug = doc.id === 'index' ? 'index' : doc.id
    const url = siteUrl ? `${siteUrl}/${slug}.md` : `/${slug}.md`
    const desc = doc.data.description ? `: ${doc.data.description}` : ''
    lines.push(`- [${doc.data.title}](${url})${desc}`)
  }

  lines.push('')

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
