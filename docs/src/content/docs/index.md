---
title: Red Glare
description: Astro integration for building USWDS-styled federal documentation sites with Comark.
template: splash
---

**Red Glare** is an Astro integration for building federal documentation sites the way the government actually publishes docs: real U.S. Web Design System chrome (government banner, identifier, sidenav, footer), CommonMark content processed by [Comark](https://comark.dev), and build-time validation so broken links never ship.

<!-- more -->

::summary-box
  #heading
  ### What you get out of the box

  #body
  - USWDS government banner, header, sidenav, footer, identifier, breadcrumbs, and 404.
  - Markdown-first authoring with directive components (`::alert`, `:::accordion`, `:::endpoint`, and friends).
  - Shiki syntax highlighting baked in at parse time — no runtime flash.
  - Build-time internal link validation, auto-generated sidebar, in-page TOC with scrollspy.
  - Opt-in Pagefind search, RSS feed, `llms.txt` + raw-`.md` endpoints, and i18n scaffolding.
::

## Get started

:::link-button{href="/getting-started/installation/" variant="secondary" big}
Install Red Glare
:::

:::link-button{href="/components/alert/" variant="outline"}
Browse components
:::

:::link-button{href="/reference/api-endpoint-example/" variant="outline"}
See an API reference
:::

## Why Red Glare

::alert{type="info"}
  #heading
  ### Built for federal docs, usable anywhere

  #body
  Red Glare ships USWDS chrome by default — but the templates, directive components, and build-time checks are just as useful for any documentation site that wants a content-first workflow with opinionated defaults.
::

The integration pulls in [`@astrojs/preact`](https://docs.astro.build/en/guides/integrations-guide/preact/) (compat mode), [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/), and optionally [`astro-pagefind`](https://github.com/shenxn/astro-pagefind) so you don't wire them up manually. Drop markdown into `src/content/docs/`, run `astro dev`, and the sidebar, TOC, and search index build themselves.

## Three templates, one content collection

- **`doc`** — standard documentation pages with sidenav, TOC, breadcrumbs, and prev/next.
- **`splash`** — full-width landing pages like this one.
- **`api`** — REST reference pages rendered with the `:::endpoint` directive in a sticky two-column layout.

See [Templates](/authoring/templates/) for the full breakdown.
