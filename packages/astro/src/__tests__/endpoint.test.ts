import { expect, it } from 'vitest'

import { parseContent } from '../comark'
import { extractHeadings } from '../utils/headings'
import { renderComark } from './test-utils/comark'

const FIXTURE = `
:::endpoint
---
method: GET
path: /repos/{owner}/{repo}/branches
pathParameters:
  - name: owner
    type: string
    required: true
    description: The owner of the repository.
  - name: repo
    type: string
    required: true
    description: The name of the repository.
queryParameters:
  - name: per_page
    type: integer
    default: 30
    description: Results per page.
responses:
  - status: 200
    description: Returns an array of branch objects.
  - status: 404
    description: Repository not found.
---

## List branches

Lists branches for the specified repository.
:::
`

function getEndpoint(): HTMLElement {
  return document.querySelector<HTMLElement>('section.ss-endpoint')!
}

it('endpoint: renders a section with the method + path signature strip', async () => {
  await renderComark(FIXTURE)

  const endpoint = getEndpoint()
  expect(endpoint).not.toBeNull()

  const method = endpoint.querySelector('.ss-endpoint__method')
  expect(method?.textContent).toBe('GET')
  expect(method?.className).toContain('ss-endpoint__method--get')

  const path = endpoint.querySelector('.ss-endpoint__path')
  expect(path?.textContent).toBe('/repos/{owner}/{repo}/branches')
})

it('endpoint: renders the author h2 above the signature strip', async () => {
  await renderComark(FIXTURE)

  const endpoint = getEndpoint()
  const h2 = endpoint.querySelector('h2')
  expect(h2?.textContent).toBe('List branches')

  const signature = endpoint.querySelector('.ss-endpoint__signature')
  expect(signature).not.toBeNull()
  // Signature strip comes after the heading in document order.
  const headingPos = Array.prototype.indexOf.call(endpoint.children, h2!.parentElement ?? h2)
  const sigPos = Array.prototype.indexOf.call(endpoint.children, signature)
  expect(sigPos).toBeGreaterThan(headingPos)
})

it('endpoint: normalizes the method to uppercase regardless of authoring case', async () => {
  await renderComark(`
:::endpoint
---
method: post
path: /things
---

## Create a thing
:::
`)

  const method = document.querySelector('.ss-endpoint__method')
  expect(method?.textContent).toBe('POST')
  expect(method?.className).toContain('ss-endpoint__method--post')
})

it('endpoint: renders auto-generated parameter sections from yaml attrs', async () => {
  await renderComark(FIXTURE)

  const endpoint = getEndpoint()
  const headings = Array.from(endpoint.querySelectorAll('h3')).map(h => h.textContent)
  expect(headings).toContain('Path parameters')
  expect(headings).toContain('Query parameters')
  expect(headings).toContain('Responses')

  const rows = endpoint.querySelectorAll('.ss-parameters__row')
  expect(rows.length).toBe(3)

  const owner = rows[0]
  expect(owner.querySelector('.ss-parameters__name')?.textContent).toBe('owner')
  expect(owner.querySelector('.ss-parameters__type')?.textContent).toBe('string')
  expect(owner.querySelector('.ss-parameters__pill--required')).not.toBeNull()
  expect(owner.querySelector('.ss-parameters__description')?.textContent).toContain('The owner of the repository.')

  const perPage = rows[2]
  expect(perPage.querySelector('.ss-parameters__name')?.textContent).toBe('per_page')
  expect(perPage.querySelector('.ss-parameters__pill--required')).toBeNull()
  expect(perPage.querySelector('.ss-parameters__meta')?.textContent).toContain('30')
})

it('endpoint: renders the responses as a status-code table in the left column', async () => {
  await renderComark(FIXTURE)

  const leftCol = document.querySelectorAll('.ss-endpoint__col')[0]
  const table = leftCol.querySelector('table.ss-responses')
  expect(table).not.toBeNull()

  const headers = Array.from(table!.querySelectorAll('thead th')).map(th => th.textContent)
  expect(headers).toEqual(['Status code', 'Description'])

  const rows = table!.querySelectorAll('tbody tr')
  expect(rows.length).toBe(2)
  expect(rows[0].querySelector('code')?.textContent).toBe('200')
  expect(rows[0].querySelectorAll('td')[1].textContent).toContain('Returns an array of branch objects.')
  expect(rows[1].querySelector('code')?.textContent).toBe('404')
})

it('endpoint: shows the Deprecated pill when `deprecated: true`', async () => {
  await renderComark(`
:::endpoint
---
method: DELETE
path: /things/{id}
deprecated: true
---

## Delete a thing

Removed in v2.
:::
`)

  const deprecated = document.querySelector('.ss-endpoint__pill--deprecated')
  expect(deprecated).not.toBeNull()
  expect(deprecated?.textContent).toBe('Deprecated')
})

it('endpoint: headings inside an endpoint still get ids from attachTocHeadings', async () => {
  const tree = await parseContent(FIXTURE)
  const headings = extractHeadings(tree)

  const slugs = headings.map(h => h.slug)
  expect(slugs).toContain('list-branches')
})

it('endpoint: rejects unknown attribute keys at parse time', async () => {
  await expect(parseContent(`
:::endpoint
---
method: GET
path: /things
bogus: nope
---

## Things
:::
`)).rejects.toThrow(/endpoint block failed validation/)
})

it('endpoint: rejects parameters missing required fields', async () => {
  await expect(parseContent(`
:::endpoint
---
method: GET
path: /things
pathParameters:
  - name: owner
---

## Things
:::
`)).rejects.toThrow(/endpoint block failed validation/)
})
