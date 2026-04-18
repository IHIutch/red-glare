---
title: Quickstart
description: Write your first page, preview it locally, and ship a build.
sidebar:
  order: 3
---

This walks through authoring a new page, running the dev server, and producing a production build. If you haven't yet, follow [Installation](/getting-started/installation/) first.

## 1. Write a page

Create `src/content/docs/guides/welcome.md`:

```markdown [src/content/docs/guides/welcome.md]
---
title: Welcome
description: A short introduction to our documentation.
sidebar:
  order: 1
---

Welcome to **My Agency Docs**. This page is a normal markdown file with
a minimal frontmatter block.

## Overview

Anything in `src/content/docs/` becomes a page, with the URL derived
from the file path. This file is served at `/guides/welcome/`.

::alert{type="info"}
Red Glare supports [directive components](/authoring/directives/) like
this alert directly in markdown.
::

## Next steps

- [Browse the components](/components/alert/)
- [Customize the sidebar](/configuration/navigation/)
```

The `title` field is required; everything else is optional.

## 2. Start the dev server

::code-group
```bash [pnpm]
pnpm dev
```
```bash [npm]
npm run dev
```
```bash [yarn]
yarn dev
```
::

Astro starts a local server at `http://localhost:4321`. Open it and you'll see the USWDS header, government banner, and your welcome page in the `guides` sidebar group.

Edits to markdown files hot-reload. Schema validation errors (missing `title`, wrong type for `sidebar.order`, etc.) show up in the terminal and the browser overlay.

## 3. Check internal links

Red Glare validates every internal link at build time. Broken `<a href="/some/page/">` references fail the build — they do not emit a 404 at runtime.

The check runs on `astro build`. Run it once to confirm your page is link-clean:

::code-group
```bash [pnpm]
pnpm build
```
```bash [npm]
npm run build
```
```bash [yarn]
yarn build
```
::

A successful build writes static assets to `dist/`. See [Link validator](/features/link-validator/) for how the check works and how to exempt external or intentionally-broken links.

## 4. Preview the build

::code-group
```bash [pnpm]
pnpm preview
```
```bash [npm]
npm run preview
```
```bash [yarn]
yarn preview
```
::

`astro preview` serves the built `dist/` directory. The preview runs exactly the output your CDN will ship — syntax-highlighted code blocks are pre-rendered (no client-side Shiki), Pagefind's index is in place if enabled, and the sitemap + `feed.xml` + `llms.txt` endpoints are live.

## 5. Deploy

`dist/` is a static site. Upload it anywhere that serves static files:

- **Cloudflare Workers** — see [Cloudflare Workers deployment](/deployment/cloudflare-workers/).
- **Netlify, Vercel, GitHub Pages, S3, Azure Static Web Apps** — see [Static hosts](/deployment/static-hosts/).

::summary-box
  #heading
  ### You now have a working docs site

  #body
  From here, explore:
  - [Components](/components/alert/) to see what ships out of the box
  - [Configuration](/configuration/overview/) for site-wide options
  - [Authoring](/authoring/frontmatter/) for the full markdown + frontmatter reference
::
