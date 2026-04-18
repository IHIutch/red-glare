---
title: Search
description: Full-text search via Pagefind.
sidebar:
  order: 1
---

Red Glare integrates [Pagefind](https://pagefind.app) — a static, self-hosted full-text search engine that indexes your built site at the end of `astro build` and ships a small client bundle for the search UI.

## Enable it

Set `pagefind: true` in `astro.config.mjs`:

```js
redGlare({
  pagefind: true,
})
```

That's the entire configuration. On `astro build`, the integration:

1. Auto-registers `astro-pagefind` alongside the build.
2. Runs the Pagefind indexer against `dist/`.
3. Writes the search index to `dist/pagefind/`.
4. Renders a search input in the USWDS header that hydrates the Pagefind UI on first interaction.

::alert{type="info"}
  #heading
  ### It's a build-time feature

  #body
  No server, no API. Pagefind ships as static assets alongside the site. Search works on any static host — Cloudflare, Netlify, S3, GitHub Pages.
::

## Dev mode

Pagefind needs a built site to generate its index. In `astro dev`, the search input is rendered but returns no results. Use `astro build && astro preview` to test search locally.

## What gets indexed

Pagefind indexes everything inside `<main id="main-content">` — which is every page's article body. The sidebar, TOC, header, and footer are excluded automatically.

Inside the body:

- Headings carry extra weight for ranking.
- Code blocks are indexed (useful for finding API names).
- Metadata like page titles and descriptions is prioritized.

To exclude a section from the index, wrap it in `<div data-pagefind-ignore>`. Rarely needed — Pagefind's default heuristics are good.

## Customizing results

Pagefind's default UI is already wired up. For deeper customization — custom result rendering, filters, multi-site search — see the [Pagefind docs](https://pagefind.app/docs/).

## Turning it off

Drop `pagefind` from the config (or set it to `false`). No Pagefind dependency is loaded, no index is built, and the search input is omitted from the header.

## Build output size

Pagefind's index grows linearly with the amount of content. A ~20-page docs site adds roughly 200–500 KB of index files. Larger sites (hundreds of pages) will see a few MB — still a good trade-off versus the alternative of hitting a third-party API on every keypress.
