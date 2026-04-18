---
title: RSS feed
description: Auto-generated feed.xml for your documentation.
sidebar:
  order: 2
---

Red Glare can generate an RSS 2.0 feed at `/feed.xml` covering every non-draft page in your `docs` collection. Useful for readers who follow changes via feed readers, and for chaining updates into external services (Slack, IFTTT, etc.).

## Enable it

Set `rss: true` in `astro.config.mjs`:

```js
redGlare({
  rss: true,
})
```

The integration uses [`@astrojs/rss`](https://docs.astro.build/en/guides/rss/) under the hood. On `astro build`, a `feed.xml` route is injected and the feed is pre-rendered to `dist/feed.xml`.

## What's in the feed

Each entry includes:

- **`<title>`** — page's frontmatter `title`.
- **`<link>`** — absolute URL using the `site` from `astro.config.mjs`.
- **`<description>`** — frontmatter `description`, or the extracted summary (content before `<!-- more -->`), or the first paragraph.
- **`<pubDate>`** — not populated by default (the schema has no date field). Add a custom field in frontmatter if you want publish dates in the feed.

Channel-level:

- **`<title>`** — integration `title`.
- **`<description>`** — integration `description`.
- **`<link>`** — the `site` URL.

## Excluding pages

Draft pages (frontmatter `draft: true`) are skipped:

```yaml
---
title: Work in progress
draft: true
---
```

Splash pages (frontmatter `template: splash`) are typically excluded from the feed — they're landing content, not articles. Verify the current behavior against your site's output if the distinction matters to you.

## Linking to the feed

Add the feed to the USWDS footer's social links for a visible subscribe button:

```js
redGlare({
  footer: {
    social: [
      { platform: 'rss', href: '/feed.xml' },
    ],
  },
})
```

Or inject a `<link rel="alternate">` in `<head>` so feed readers can auto-discover it:

```js
redGlare({
  head: [
    {
      tag: 'link',
      attrs: {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: '/feed.xml',
        title: 'My Agency Docs',
      },
    },
  ],
})
```

## Turning it off

Omit `rss` (or set to `false`). The `feed.xml` route isn't injected, no feed is built.
