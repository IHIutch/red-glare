// Raw markdown endpoint — outputs the original markdown source for each doc
// page so LLMs and AI tools can fetch structured content without parsing HTML.
// Injected conditionally when config.llms is true.
import { getCollection } from 'astro:content'

import type { DocsEntry } from '../schema.js'

export async function getStaticPaths() {
  // getCollection returns `any` inside integration packages — Astro's
  // collection types are codegen'd in the user project, not the library.
  const docs = (await getCollection('docs')) as unknown as DocsEntry[]
  // Unlike the HTML route (which maps "index" → undefined to produce
  // /index.html), the .md route keeps "index" as a literal slug so the
  // output is /index.md, not /.md.
  return docs.map(doc => ({
    params: { slug: doc.id },
    props: { doc },
  }))
}

export async function GET({ props }: { props: { doc: DocsEntry } }) {
  const { doc } = props

  // Reconstruct the full markdown source: YAML frontmatter + body
  const meta: Record<string, unknown> = {}
  if (doc.data.title)
    meta.title = doc.data.title
  if (doc.data.description)
    meta.description = doc.data.description

  const frontmatterLines = Object.entries(meta)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join('\n')

  const content = frontmatterLines
    ? `---\n${frontmatterLines}\n---\n\n${doc.body ?? ''}`
    : doc.body ?? ''

  return new Response(content, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
