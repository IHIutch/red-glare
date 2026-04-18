---
title: Red Glare
description: Astro integration for building USWDS-styled federal documentation sites with Comark.
template: splash
hero:
  text: Let's build USWDS docs sites together
  tagline: Red Glare is an Astro integration for building federal documentation sites with real USWDS chrome, Comark-powered content, and build-time link validation — so every page ships production-ready.
  actions:
    - text: Get started
      link: /getting-started/installation/
    - text: Browse components
      link: /components/alert/
      variant: outline
features:
  - icon: 🏛️
    title: USWDS out of the box
    details: Government banner, header, sidenav, footer, identifier, breadcrumbs, and 404 — all real USWDS markup. No reimplemented chrome.
    link: /configuration/overview/
    linkText: See the configuration
  - icon: ✍️
    title: Markdown-first authoring
    details: CommonMark via Comark, with MDC directives for alerts, accordions, code groups, tabs, process lists, summary boxes, and REST endpoint reference blocks.
    link: /authoring/directives/
    linkText: Write with directives
  - icon: 🔗
    title: Link validation at build time
    details: Broken internal links fail the build — not production. Cross-references stay honest as content evolves.
    link: /features/link-validator/
    linkText: How validation works
  - icon: 🔎
    title: Search, RSS, llms.txt
    details: Pagefind search, RSS feed, sitemap, and llms.txt + raw-markdown endpoints for AI accessibility. One flag each.
    link: /features/search/
    linkText: Turn on search
  - icon: 🎨
    title: Themed with USWDS tokens
    details: Override USWDS Sass tokens to customize colors, fonts, and spacing. Variable fonts preloaded; zero runtime theming cost.
    link: /styling/theming/
    linkText: Customize the theme
  - icon: 📦
    title: Static output anywhere
    details: Builds to plain `dist/` — deploy to Cloudflare Workers, Netlify, Vercel, GitHub Pages, S3, or anywhere that serves HTML.
    link: /deployment/cloudflare-workers/
    linkText: Deploy to Cloudflare
---

