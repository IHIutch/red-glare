import { expect, it } from 'vitest'

import { parseContent } from '../comark'
import { validateLinks } from '../utils/link-validator'

async function makeDoc(slug: string, markdown: string) {
  const tree = await parseContent(markdown)
  return { slug, tree }
}

it('link-validator: passes when every internal link resolves', async () => {
  const docs = [
    await makeDoc('index', `
# Home

[Components](/components/) and [the getting started guide](/getting-started/#install).
`),
    await makeDoc('components', `
## Alerts

See [the filing deadline](#filing-deadline).

### Filing deadline

Text.
`),
    await makeDoc('getting-started', `
## Install

Details.
`),
  ]

  const report = validateLinks(docs)
  expect(report.broken).toEqual([])
  expect(report.checked).toBeGreaterThan(0)
})

it('link-validator: reports fragment links that miss an id on the same page', async () => {
  const docs = [
    await makeDoc('page', `
# Page

See [the missing section](#does-not-exist).

## A section
`),
  ]

  const report = validateLinks(docs)
  expect(report.broken).toHaveLength(1)
  expect(report.broken[0]).toMatchObject({
    sourceSlug: 'page',
    href: '#does-not-exist',
  })
  expect(report.broken[0].reason).toContain('does-not-exist')
})

it('link-validator: reports absolute-path links to unknown docs', async () => {
  const docs = [
    await makeDoc('index', `[nowhere](/ghost/)`),
  ]

  const report = validateLinks(docs)
  expect(report.broken).toHaveLength(1)
  expect(report.broken[0].href).toBe('/ghost/')
  expect(report.broken[0].reason).toContain('ghost')
})

it('link-validator: reports absolute-path links whose anchor is missing on the target page', async () => {
  const docs = [
    await makeDoc('index', `[broken anchor](/other/#ghost-anchor)`),
    await makeDoc('other', `## Real heading`),
  ]

  const report = validateLinks(docs)
  expect(report.broken).toHaveLength(1)
  expect(report.broken[0].href).toBe('/other/#ghost-anchor')
  expect(report.broken[0].reason).toContain('ghost-anchor')
})

it('link-validator: skips external links, mailto/tel, and bare `#`', async () => {
  const docs = [
    await makeDoc('index', `
- [docs site](https://docs.example.gov/foo)
- [email us](mailto:help@example.gov)
- [call us](tel:+18005551234)
- [top of page](#)
`),
  ]

  const report = validateLinks(docs)
  expect(report.broken).toEqual([])
})

it('link-validator: respects the `ignore` option for author-managed dynamic links', async () => {
  const docs = [
    await makeDoc('index', `[status page](/status/)`),
  ]

  const report = validateLinks(docs, { ignore: ['/status/'] })
  expect(report.broken).toEqual([])
})

it('link-validator: resolves fragment links that target author-set element ids, not just headings', async () => {
  const docs = [
    await makeDoc('page', `
See [the note](#important-note).

<div id="important-note">Note body.</div>
`),
  ]

  const report = validateLinks(docs)
  expect(report.broken).toEqual([])
})

it('link-validator: strips the configured `base` prefix before looking up the slug', async () => {
  const docs = [
    await makeDoc('index', `[components](/docs/components/)`),
    await makeDoc('components', `## Alerts`),
  ]

  const report = validateLinks(docs, { base: '/docs' })
  expect(report.broken).toEqual([])
})

it('link-validator: flags absolute paths that are outside the configured base', async () => {
  const docs = [
    await makeDoc('index', `[outside](/other/path/)`),
    await makeDoc('components', `## Alerts`),
  ]

  const report = validateLinks(docs, { base: '/docs' })
  expect(report.broken).toHaveLength(1)
  expect(report.broken[0].reason).toContain('outside the configured base')
})

it('link-validator: treats fully-qualified self-referential links as internal when `site` is set', async () => {
  const docs = [
    await makeDoc('index', `
[components](https://example.gov/components/)
[bad anchor](https://example.gov/components/#ghost)
`),
    await makeDoc('components', `## Alerts`),
  ]

  const report = validateLinks(docs, { site: 'https://example.gov' })
  expect(report.broken).toHaveLength(1)
  expect(report.broken[0].href).toBe('https://example.gov/components/#ghost')
  expect(report.broken[0].reason).toContain('ghost')
})

it('link-validator: self-referential + base work together', async () => {
  const docs = [
    await makeDoc('index', `[components](https://example.gov/docs/components/)`),
    await makeDoc('components', `## Alerts`),
  ]

  const report = validateLinks(docs, {
    site: 'https://example.gov',
    base: '/docs',
  })
  expect(report.broken).toEqual([])
})
