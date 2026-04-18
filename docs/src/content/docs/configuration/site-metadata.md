---
title: Site metadata
description: Title, description, logo, and custom head tags.
sidebar:
  order: 2
---

Site-level metadata controls what appears in the browser title bar, the USWDS header, social cards (via `astro-seo`), and the `<head>`.

## `title`

**Type:** `string` · **Required**

The site title. Rendered in:

- The USWDS header next to (or in place of) the logo.
- Every page's `<title>` tag, formatted as `Page Title · Site Title`.
- OpenGraph and Twitter meta (`og:site_name`).
- The RSS feed channel title.

```js
redGlare({
  title: 'My Agency Docs',
})
```

## `description`

**Type:** `string` · **Optional**

The site-level description. Used as the default `<meta name="description">` when a page's own frontmatter `description` is missing, and as the RSS channel description.

```js
redGlare({
  description: 'Official documentation for My Agency',
})
```

## `logo`

**Type:** `string` · **Optional**

Path to a logo image rendered in the USWDS header alongside the site title. Path is resolved from `public/`:

```js
redGlare({
  logo: '/agency-seal.svg',
})
```

::alert{type="info"}
  #heading
  ### Placement

  #body
  The logo renders at USWDS's `usa-logo__img` size — about 40px tall in the default theme. If your logo needs a different aspect ratio, override the USWDS token in [theming](/styling/theming/).
::

## `head`

**Type:** `HeadTag[]` · **Default:** `[]`

Array of raw `<head>` tags to inject into every page. Each entry has:

- `tag` — the element name (`meta`, `link`, `script`, etc.).
- `attrs?` — record of `string | boolean` attributes.
- `content?` — inner content (for `<script>` / `<style>`).

```js
redGlare({
  head: [
    {
      tag: 'meta',
      attrs: { name: 'theme-color', content: '#162e51' },
    },
    {
      tag: 'link',
      attrs: { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    },
    {
      tag: 'script',
      attrs: { src: 'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js', async: true },
    },
  ],
})
```

::alert{type="warning"}
  #heading
  ### Keep it small

  #body
  Anything you put in `head` renders on every page. Reserve it for sitewide essentials — favicons, analytics, theme color. Per-page meta belongs in the page's frontmatter `description`, which flows through `astro-seo` automatically.
::

## Page-level overrides

Site metadata is a fallback. When a page's frontmatter includes its own `title` or `description`, that takes precedence for meta tags on that page. See [Frontmatter](/authoring/frontmatter/) for the per-page fields.
