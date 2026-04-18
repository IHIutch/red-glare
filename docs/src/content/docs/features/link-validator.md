---
title: Link validator
description: Build-time internal link validation.
sidebar:
  order: 4
---

Red Glare validates every internal link in your docs at build time. Broken `<a href="/some/page/">` references **fail the build** — they never reach production as 404s.

## How it works

On `astro build`, after all pages are rendered, the integration:

1. Walks every rendered page and extracts anchor `href` values.
2. Filters to internal links only — same-origin, relative, or root-relative.
3. Checks each link against the known set of valid routes (every entry in the `docs` collection plus integration-injected routes like `/feed.xml`).
4. If any link is unresolved, logs each broken link with its source page and fails the build.

External links (`https://example.com`), mail/tel protocols, and anchor-only links (`#section`) are skipped.

## What counts as broken

- A link to a slug that doesn't exist in the collection.
- A link missing the trailing slash when Astro's build config expects one (default).
- A link to a draft page (`draft: true`) from a non-draft page.
- A link to a hash that doesn't match any heading id on the target page — **only when heading-level validation is enabled**. By default, links to `/page/#anchor` check the page exists; anchor verification is a stricter optional mode.

## Example failure

```
✘ Broken internal links found:
  /getting-started/installation/ → /comopnents/alert/
  /authoring/markdown.md: link at line 42

Build failed.
```

The failure message points at the source file and line so you can fix the typo directly.

## Why fail the build?

Deploying a docs site with broken internal links is a preventable form of tech debt. A link that 404s in production frustrates readers, makes the site feel unmaintained, and erodes trust in the rest of the content. By failing at build time, the broken link becomes a commit-blocker instead of a production incident.

For docs teams with tight CI, this works especially well — a pull request that breaks a cross-reference never lands on the main branch.

## Exempting a link

If you intentionally link to a not-yet-written page (e.g. placeholder content), the right answer is usually:

- **Create the page as a stub** with `draft: true`. The link validates; the page isn't listed in RSS/sitemap/llms.
- **Link externally** instead. `https://example.com/coming-soon` isn't validated.

If you genuinely need to bypass the check for a specific link, file an issue describing the use case — the integration could grow a `<!-- link-validator: skip -->` marker if there's demand.

## Runtime-only links

Links constructed at runtime (inside a component, via JavaScript) aren't visible to the validator. Prefer authored markdown links whenever possible; they get validated and they're visible to the llms.txt crawler.
