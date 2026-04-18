---
title: API endpoint example
description: A complete worked example of the template=api layout with :::endpoint directives.
template: api
apiVersion: "2026-04-17"
sidebar:
  label: API reference example
  order: 1
---

This page is a fully-worked example of the `api` template — showing what REST reference pages look like with real `:::endpoint` directives. The content is fictional; the structure mirrors what an agency API reference would contain.

::alert{type="info"}
Endpoints on this page are for illustration only. For the real GitHub Branches API (the inspiration for this example), see the [GitHub REST API docs](https://docs.github.com/en/rest/branches/branches).
::

## Overview

All endpoints require a valid API token. For an overview of authentication and rate limits, see the [installation guide](/getting-started/installation/). Requests are rate-limited to 5,000 calls per hour per token.

## Endpoints

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
    description: When true, returns only protected branches.
  - name: per_page
    type: integer
    default: 30
    description: Results per page (max 100).
  - name: page
    type: integer
    default: 1
    description: Page number of the results to fetch.
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

```python [Python]
response = requests.get(
    f"https://api.github.com/repos/{owner}/{repo}/branches",
    headers={"Accept": "application/vnd.github+json"},
)
```
:::

#response

```json
[
  {
    "name": "main",
    "commit": {
      "sha": "c5b97d5ae6c19dc5df71a34c7fbeeda2479ccbc",
      "url": "https://api.github.com/repos/OWNER/REPO/commits/c5b97d5ae6c19dc5df71a34c7fbeeda2479ccbc"
    },
    "protected": true
  },
  {
    "name": "develop",
    "commit": {
      "sha": "a1b2c3d4e5f60718293a4b5c6d7e8f9012345678",
      "url": "https://api.github.com/repos/OWNER/REPO/commits/a1b2c3d4e5f60718293a4b5c6d7e8f9012345678"
    },
    "protected": false
  }
]
```
::

::endpoint
---
method: GET
path: /repos/{owner}/{repo}/branches/{branch}
pathParameters:
  - name: owner
    type: string
    required: true
    description: The account that owns the repository.
  - name: repo
    type: string
    required: true
    description: The name of the repository.
  - name: branch
    type: string
    required: true
    description: The name of the branch. Cannot contain wildcards.
responses:
  - status: 200
    description: Returns the branch object.
  - status: 301
    description: The branch was renamed.
  - status: 404
    description: Branch or repository does not exist.
---

## Get a branch

Returns a single branch, including its latest commit and protection status. Pass the branch name without URL-encoding — the API normalizes slashes.

#request

```bash
curl -L \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/OWNER/REPO/branches/main
```

#response

```json
{
  "name": "main",
  "commit": {
    "sha": "c5b97d5ae6c19dc5df71a34c7fbeeda2479ccbc",
    "url": "https://api.github.com/repos/OWNER/REPO/commits/c5b97d5ae6c19dc5df71a34c7fbeeda2479ccbc"
  },
  "_links": {
    "self": "https://api.github.com/repos/OWNER/REPO/branches/main",
    "html": "https://github.com/OWNER/REPO/tree/main"
  },
  "protected": true,
  "protection": {
    "enabled": true,
    "required_status_checks": {
      "enforcement_level": "non_admins",
      "contexts": ["ci/build", "ci/test"]
    }
  }
}
```
::

::endpoint
---
method: POST
path: /repos/{owner}/{repo}/branches/{branch}/rename
pathParameters:
  - name: owner
    type: string
    required: true
  - name: repo
    type: string
    required: true
  - name: branch
    type: string
    required: true
    description: The current branch name.
bodyParameters:
  - name: new_name
    type: string
    required: true
    description: The desired new name for the branch.
responses:
  - status: 201
    description: Returns the renamed branch object.
  - status: 403
    description: The token lacks write permission.
  - status: 422
    description: The new name is invalid or already exists.
---

## Rename a branch

Rename a branch and update any refs that point to it. Pull requests, webhooks, and other branch-aware features update automatically.

#request

```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d '{"new_name": "trunk"}' \
  https://api.github.com/repos/OWNER/REPO/branches/main/rename
```

#response

```json
{
  "name": "trunk",
  "commit": { "sha": "...", "url": "..." },
  "protected": true
}
```
::

::endpoint
---
method: DELETE
path: /repos/{owner}/{repo}/branches/{branch}
deprecated: true
pathParameters:
  - name: owner
    type: string
    required: true
  - name: repo
    type: string
    required: true
  - name: branch
    type: string
    required: true
    description: The name of the branch to delete.
responses:
  - status: 204
    description: Branch deleted.
  - status: 403
    description: The branch is protected.
  - status: 404
    description: Branch does not exist.
---

## Delete a branch

This endpoint is deprecated and will be removed in the next API version. Use the `DELETE /repos/{owner}/{repo}/git/refs/heads/{branch}` endpoint instead.
::

## What this page demonstrates

- Four `:::endpoint` directives in a single page, each rendering its own two-column layout.
- `apiVersion` frontmatter producing the version pill.
- `deprecated: true` on the last endpoint rendering the Deprecated pill.
- Parameter sections (`pathParameters`, `queryParameters`, `bodyParameters`) auto-rendering only when populated.
- `:::code-group` nested inside the `#request` slot for multi-language code alternatives.
- Plain fenced code blocks inside `#response` when a single example is enough.
