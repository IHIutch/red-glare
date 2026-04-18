---
title: Edit links
description: Wire up "Edit this page on GitHub" links for every doc.
sidebar:
  order: 6
---

Doc templates render an "Edit this page" link near the bottom of every page. It points readers at the source file in your repo so they can submit corrections via pull request.

## `editLink`

**Type:** `{ baseUrl: string }` · **Optional**

Set `editLink.baseUrl` to the repo URL prefix. Red Glare appends each page's file path from the content collection to build the final link.

```js
redGlare({
  editLink: {
    baseUrl: 'https://github.com/example/my-docs/edit/main/',
  },
})
```

For a page at `src/content/docs/guides/setup.md`, this produces:

```
https://github.com/example/my-docs/edit/main/src/content/docs/guides/setup.md
```

::alert{type="info"}
  #heading
  ### Trailing slash matters

  #body
  `baseUrl` is concatenated directly with the page's file path. Include a trailing slash so the join produces a valid URL.
::

## What "edit" means on different hosts

- **GitHub**: `.../edit/<branch>/` opens the web editor with the file pre-loaded and a "propose changes" flow that creates a fork and pull request.
- **GitLab**: `.../edit/<branch>/` has an equivalent flow.
- **Bitbucket**: `.../src/<branch>/?at=<branch>` or the file edit path — different structure per org.

Red Glare doesn't care which host you use; it just concatenates.

## Turning it off

Omit the `editLink` field entirely. No "Edit this page" link renders. This is the right choice for:

- Private repositories readers can't access.
- Generated content that shouldn't be edited directly (e.g. CLI reference regenerated from source).
- Mirror/snapshot docs.

## Per-template behavior

The edit link renders on `doc` and `api` templates. The `splash` template is designed for marketing/landing content, which usually doesn't benefit from a "propose an edit" call-to-action — so the link is omitted there.
