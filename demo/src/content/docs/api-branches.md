---
title: Branches
description: List, retrieve, and manage repository branches.
template: api
apiVersion: "2026-03-10"
sidebar:
  label: API — Branches
  order: 4
---

Work with branches in a repository. All endpoints require a valid API
token. For an overview of authentication and rate limits, see the
[Components reference](/components/).

::alert{type="info"}
Requests are rate-limited to 5,000 calls per hour per token. See the
`X-RateLimit-Remaining` response header.
::

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

Lists branches for the specified repository. Results are paginated —
check the `Link` response header for `next`/`prev` URLs.

#request

:::code-group
```bash [cURL]
curl -L \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/OWNER/REPO/branches
```

```javascript [octokit.js]
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

Returns a single branch, including its latest commit and protection
status. Pass the branch name without URL-encoding — the API normalizes
slashes.

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
    description: The account that owns the repository.
  - name: repo
    type: string
    required: true
    description: The name of the repository.
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

This endpoint is deprecated and will be removed in the next API version.
Use [Delete a reference](/components/) instead.

::
