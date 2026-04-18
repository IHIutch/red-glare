---
title: llms.txt & raw markdown endpoints
description: AI-accessibility endpoints for docs sites.
sidebar:
  order: 3
---

Red Glare exposes two AI-accessibility endpoints by default:

- **`/llms.txt`** — index of every non-draft page following the [llmstxt.org spec](https://llmstxt.org).
- **`/<slug>.md`** — raw markdown source for every page, served alongside the rendered HTML.

Together they let AI assistants pull your documentation as-authored without screen-scraping HTML.

## It's on by default

```js
redGlare({
  llms: true, // default
})
```

Set `llms: false` to opt out — the routes aren't injected and the endpoints return 404.

## What `/llms.txt` looks like

The `llms.txt` file is a structured index: site title + description, then a list of pages grouped by sidebar section. Example shape:

```
# Red Glare

> Astro integration for building USWDS-styled federal documentation sites with Comark.

## Getting Started

- [Installation](https://redglare.dev/getting-started/installation/): Install Red Glare into a new or existing Astro project.
- [Project structure](https://redglare.dev/getting-started/project-structure/): What the files in a Red Glare project do and how they fit together.
- [Quickstart](https://redglare.dev/getting-started/quickstart/): Write your first page, preview it locally, and ship a build.

## Configuration

- [Configuration overview](...): ...
...
```

AI crawlers (and humans, and feed readers) can hit this one file and discover every page on the site.

## What `/<slug>.md` returns

For any rendered page at `/some/path/`, appending `.md` returns the raw source:

```
GET /getting-started/installation/       → HTML
GET /getting-started/installation.md     → raw markdown
```

This bypasses the rendering pipeline entirely — the response is the `.md` file as authored. Frontmatter is included. Directives are **not** expanded — the assistant reads them as `::alert{...}` blocks.

## Why it matters

AI assistants and search tools increasingly scrape HTML to answer questions about your docs. HTML scraping is lossy — it strips markdown semantics, directives become rendered HTML soup, and code blocks lose their language hints.

By serving the raw markdown alongside the HTML, you give tools a clean, structured copy of your content. The `llms.txt` index makes discovery trivial. The content is still your primary UI for humans; AI just gets a better view into it.

## Excluding pages

Pages with `draft: true` are excluded from both `/llms.txt` and their `.md` endpoint (the `.md` URL returns 404 for drafts).

## Turning off just `/llms.txt` but keeping `.md`

Not currently supported — they're a single feature flag. If you need one but not the other, file an issue on the [repo](https://github.com/IHIutch/red-glare/issues).
