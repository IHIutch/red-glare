---
title: Endpoint
description: REST endpoint reference block with structured parameters and examples.
sidebar:
  order: 4
---

The `:::endpoint` directive is Red Glare's specialized block for documenting a single REST endpoint. It renders a sticky two-column layout with method/path signature, narrative description, parameter tables, response codes, and request/response examples.

Use it inside pages with `template: api` frontmatter (see [API endpoint example](/reference/api-endpoint-example/) for a complete worked example).

## Directive structure

`::endpoint` has three distinct sections:

1. A **YAML frontmatter block** (fenced with `---`) carrying the structured fields — method, path, parameters, responses.
2. A **markdown body** — the narrative description (headings, paragraphs, any directives).
3. Two **named slots** — `#request` and `#response` — for the right-column code examples.

```markdown
::endpoint
---
method: GET
path: /repos/{owner}/{repo}/branches
pathParameters:
  - name: owner
    type: string
    required: true
    description: The account that owns the repository.
responses:
  - status: 200
    description: Returns an array of branches.
---

## List branches

Lists branches for the specified repository.

#request

:::code-group
```bash [cURL]
curl -L https://api.github.com/repos/OWNER/REPO/branches
```
:::

#response

```json
[{"name": "main", "protected": true}]
```
::
```

The YAML is validated by a zod schema at parse time — wrong types fail the build with the field name in the error.

## Schema

### Top-level fields

| Field | Type | Required |
| --- | --- | --- |
| `method` | `string` (GET, POST, PUT, PATCH, DELETE, ...) | yes |
| `path` | `string` | yes |
| `id` | `string` | no — custom element id for deep linking |
| `deprecated` | `boolean \| string` | no — renders a "Deprecated" pill |
| `pathParameters` | `Parameter[]` | no |
| `queryParameters` | `Parameter[]` | no |
| `headerParameters` | `Parameter[]` | no |
| `bodyParameters` | `Parameter[]` | no |
| `responses` | `Response[]` | no |

### `Parameter`

| Field | Type | Required |
| --- | --- | --- |
| `name` | `string` | yes |
| `type` | `string` | yes (e.g. `string`, `integer`, `boolean`) |
| `required` | `boolean` | no |
| `description` | `string` | no |
| `enum` | `Array<string \| number>` | no — renders "Allowed values" list |
| `default` | `string \| number \| boolean` | no — renders "Default" line |

### `Response`

| Field | Type | Required |
| --- | --- | --- |
| `status` | `number \| string` | yes (e.g. `200`, `404`, or `"2XX"`) |
| `description` | `string` | no |

## Layout

The rendered endpoint has three visual regions:

- **Header** — author's first heading (`##`) plus optional Deprecated pill, followed by the method + path signature strip.
- **Left column** (`grid-col-6`) — narrative body, then auto-rendered parameter sections and response table.
- **Right column** (`grid-col-6`, sticky) — `#request` example(s) and `#response` example(s).

Parameter sections only render when their array is populated — omit `queryParameters` entirely and no Query parameters heading appears.

## Live example

::endpoint
---
method: GET
path: /repos/{owner}/{repo}/branches
pathParameters:
  - name: owner
    type: string
    required: true
    description: The account that owns the repository.
  - name: repo
    type: string
    required: true
    description: The name of the repository.
queryParameters:
  - name: protected
    type: boolean
    description: Returns only protected branches.
  - name: per_page
    type: integer
    default: 30
    description: Results per page (max 100).
responses:
  - status: 200
    description: Returns an array of short branch objects.
  - status: 404
    description: Repository does not exist or the token lacks access.
---

## List branches

Lists branches for the specified repository. Results are paginated — check the `Link` response header for `next`/`prev` URLs.

#request

:::code-group
```bash [cURL]
curl -L \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/OWNER/REPO/branches
```
```javascript [JavaScript]
await octokit.request('GET /repos/{owner}/{repo}/branches', {
  owner: 'OWNER',
  repo: 'REPO',
})
```
:::

#response

```json
[
  {
    "name": "main",
    "protected": true
  }
]
```
::

## Deprecated endpoints

Mark an endpoint as deprecated to render the pill next to the heading:

```yaml
deprecated: true
```

The pill is visual only — the endpoint still renders normally. Include guidance in the narrative body pointing readers at the replacement endpoint.

## Source

Component: [`packages/astro/src/components/Endpoint.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/Endpoint.tsx)

Schema (validated at parse time): [`packages/astro/src/comark-plugins/endpoint.ts`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/comark-plugins/endpoint.ts)
