import type { APIContext } from 'astro'

// RSS feed route — only active when rss: true in config
// Injected conditionally by the integration
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

import type { DocsEntry } from '../schema'

import { extractSummaryText, parseContent } from '../comark'

export async function GET(context: APIContext) {
  // Import config at runtime via virtual module
  const { default: config } = await import('virtual:red-glare/config')

  const docs = (await getCollection('docs', (entry: DocsEntry) => !entry.data.draft)) as DocsEntry[]

  // Parse each doc once so we can fall back to its `<!-- more -->` summary
  // when no frontmatter description is supplied. Build-time only — fine.
  const items = await Promise.all(
    docs.map(async (doc) => {
      let description = doc.data.description ?? ''
      if (!description) {
        const tree = await parseContent(doc.body ?? '')
        description = extractSummaryText(tree, 280) ?? ''
      }
      return {
        title: doc.data.title,
        description,
        link: `/${doc.id}/`,
      }
    }),
  )

  return rss({
    title: config.title,
    description: config.description ?? '',
    site: context.site?.toString() ?? 'http://localhost',
    items,
  })
}
