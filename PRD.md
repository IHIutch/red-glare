# Stars and Stripes — Product Requirements Document

## Overview

Stars and Stripes is a reusable Astro integration that enables federal agencies, contractors, and developers to quickly scaffold and deploy documentation sites styled with the U.S. Web Design System (USWDS). Content is authored in CommonMark and rendered via Comark, with built-in support for syntax highlighting, math, and diagrams.

The framework follows a content-first philosophy inspired by VitePress, with a developer experience modeled after Starlight.

## Target Audience

- **Primary:** Federal agency developers and government contractors
- **Secondary:** Designers and content authors

## Core Architecture

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Framework        | Astro (SSG, integration model) |
| Content parsing  | Comark (`@comark/html`)        |
| Design system    | USWDS (`@uswds/uswds`)        |
| Search           | Pagefind (opt-in)              |
| Package format   | `@starsandstripes/astro`       |
| License          | MIT                            |
| Node target      | 24+                            |
| USWDS version    | Latest                         |

## Distribution

Stars and Stripes ships as an **Astro integration** (`@starsandstripes/astro`), installed via npm/pnpm and configured in `astro.config.mjs`. This gives users a clean upgrade path — update the package, not a forked template.

A companion **CLI scaffolder** (`create-starsandstripes`) bootstraps new projects with a minimal starter template (a few placeholder pages, basic config). A full example site may be provided as a separate repository.

## Content Authoring

### Format

All content is authored in **CommonMark** and processed by Comark. No MDX — the focus is on standard markdown with built-in components.

### Frontmatter

Each page supports YAML frontmatter for metadata:

```yaml
---
title: Page Title
description: Brief description for SEO and link cards
sidebar:
  label: Custom Nav Label    # Override auto-generated sidebar label
  order: 2                   # Override auto-generated sort order
  hidden: false              # Hide from sidebar
toc: true                    # Enable/disable table of contents (default: true)
i18n:
  lang: en                   # Page language
---
```

### Built-in Content Features

Provided by Comark's plugin system:

- **Syntax-highlighted code blocks** — via shiki, with filename labels and line highlighting
- **Math** — inline (`$...$`) and block (`$$...$$`) via KaTeX
- **Mermaid diagrams** — fenced code blocks with `mermaid` language
- **USWDS-styled alerts** — GitHub-style alert syntax (`> [!NOTE]`, `> [!WARNING]`, etc.) rendered as USWDS alert components
- **Tables** — standard CommonMark tables
- **Code groups** — tabbed code blocks for showing alternatives (e.g., npm/pnpm/yarn)

## Site Chrome & Navigation

All site chrome uses **real USWDS components** from `@uswds/uswds`, making every Stars and Stripes site a reference implementation of the design system.

### Government Banner

The USWDS government banner ("An official website of the United States government") renders above the header on every page with the expandable "Here's how you know" section. On by default, toggled via config.

### Site-Wide Alert Banner

An optional dismissible USWDS alert banner for site-wide announcements (e.g., "This site is in beta"). Configured globally via config with message, severity type, and dismissible flag. Can be overridden or suppressed per-page via frontmatter.

### Sidebar Navigation

Follows the **Starlight hybrid model**:

1. **Auto-generated** from the file/folder structure in the content directory
2. **Config overrides** available in `starsandstripes.config.mjs` for custom ordering, grouping, and labels
3. **Frontmatter overrides** for per-page label, order, and visibility

File structure example:

```
src/content/docs/
├── index.md
├── getting-started/
│   ├── installation.md
│   └── configuration.md
├── guides/
│   ├── theming.md
│   └── deployment.md
└── reference/
    └── config.md
```

### Table of Contents

- **On by default** on every page
- Renders headings at **h2–h3** depth
- Scroll-spy highlighting of the current section
- Disable per-page via `toc: false` in frontmatter

### Additional Navigation

- **Breadcrumbs** — USWDS breadcrumb component, auto-generated from page hierarchy
- **Previous / Next links** — auto-generated based on sidebar order
- **Edit on GitHub** — configurable link to the source file on GitHub

### Header & Footer

- USWDS header component with site title, optional logo, and top-level navigation
- USWDS footer component with configurable link columns, contact info, and social media links
- USWDS identifier component (required federal agency strip) with agency name/logo, parent agency, and required links
- USWDS government banner ("An official website of the United States government")

## Theming & Customization

### USWDS Settings

Agencies customize the visual layer via **USWDS SCSS settings variables**, the standard USWDS theming mechanism:

```scss
// src/styles/uswds-settings.scss
@use "uswds-core" with (
  $theme-color-primary: "blue-60v",
  $theme-color-secondary: "red-cool-50v",
  $theme-font-type-sans: "public-sans",
);
```

### Custom Head Injection

Users can inject custom scripts and meta tags into the `<head>` via config, enabling analytics (DAP, GA), custom fonts, or third-party integrations without framework changes:

```js
// starsandstripes.config.mjs
export default {
  head: [
    { tag: 'script', attrs: { src: 'https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js', async: true } },
    { tag: 'meta', attrs: { name: 'og:image', content: '/social-card.png' } },
  ],
}
```

## Search

**Pagefind** is available as an opt-in integration:

```js
// starsandstripes.config.mjs
export default {
  pagefind: true,
}
```

When enabled, the build process indexes all content pages and renders a USWDS-styled search input in the header.

## SEO & Feeds

### Open Graph & Meta Tags

Auto-generated from page frontmatter on every page:

- `og:title`, `og:description`, `og:url`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:description`
- Canonical URL
- Overridable per-page via frontmatter

### Sitemap

Auto-generated via `@astrojs/sitemap`. Produces `sitemap-index.xml` at build time with no user configuration required.

### RSS Feed

Opt-in via `rss: true` in config. Generates `/feed.xml` using `@astrojs/rss` with page title, description, date, and link for each content page.

### robots.txt

User-managed. Place a `robots.txt` in the `public/` directory (consistent with VitePress and Starlight conventions).

## 404 Page

A USWDS-styled default 404 page is included. Users can customize by creating a `404.md` in their content directory. The 404 page includes the government banner, header, footer, and identifier.

## Internationalization (i18n)

Follows the **Starlight i18n model**:

### Locale Folders

Content is organized by locale in the content directory:

```
src/content/docs/
├── en/
│   ├── index.md
│   └── getting-started.md
└── es/
    ├── index.md
    └── getting-started.md
```

### Configuration

```js
// starsandstripes.config.mjs
export default {
  defaultLocale: 'en',
  locales: {
    en: { label: 'English' },
    es: { label: 'Espanol' },
  },
}
```

### Features

- Auto-generated **language switcher** in the header
- Framework UI strings (nav labels, search placeholder, "Edit this page", etc.) translated per locale
- Linked translations — the framework connects equivalent pages across locales

## Accessibility

**WCAG 2.1 AA compliance** is a hard requirement.

- All USWDS components meet AA by default; the framework maintains this standard throughout
- Contrast ratios meet AA thresholds (4.5:1 for normal text, 3:1 for large text)
- Full keyboard navigation for all interactive elements
- Skip navigation links
- Semantic HTML landmarks (`<nav>`, `<main>`, `<aside>`, `<footer>`)
- ARIA labels on all navigation elements
- Focus indicators that meet AA contrast requirements
- Proper heading hierarchy enforced in content rendering
- Alt text validation/warnings during build for images without alt attributes

## Deployment

**Platform-agnostic SSG output.** The build produces a static `dist/` directory deployable to any static hosting:

- cloud.gov Pages / Federalist
- GitHub Pages
- Netlify
- AWS S3 + CloudFront
- Any static file server

No server-side runtime required.

## Out of Scope for v1

The following are explicitly deferred:

| Feature | Rationale |
| --- | --- |
| Dark mode | USWDS lacks official dark mode; unknown complexity |
| Built-in versioning | Follow "separate builds per version" convention |
| Analytics integration | Users handle via custom head injection |
| Component playground | Can be added as a plugin later |
| API reference auto-generation | Specialized tooling exists for this |
| Full starter template | Ship minimal template; full example as separate repo |
| Print styles | Dedicated print stylesheet deferred to v2 |
| robots.txt generation | User-managed in `public/` directory |

## Package Structure

```
@starsandstripes/astro          # Core Astro integration
create-starsandstripes          # CLI scaffolder
```

## Configuration Reference

```js
// starsandstripes.config.mjs
export default {
  // Site metadata
  title: 'My Agency Docs',
  description: 'Documentation for ...',
  logo: '/logo.svg',

  // Government banner (on by default)
  governmentBanner: true,

  // Site-wide alert banner (optional)
  alert: {
    message: 'This site is in beta. Help us improve it.',
    type: 'info', // 'info' | 'warning' | 'error' | 'success'
    dismissible: true,
  },

  // Repository (enables "Edit this page" links)
  editLink: {
    baseUrl: 'https://github.com/agency/docs/edit/main/',
  },

  // Sidebar overrides (auto-generated by default)
  sidebar: [
    {
      label: 'Getting Started',
      items: ['getting-started/installation', 'getting-started/configuration'],
    },
    {
      label: 'Guides',
      autogenerate: { directory: 'guides' },
    },
  ],

  // Search
  pagefind: false,

  // i18n
  defaultLocale: 'en',
  locales: {
    en: { label: 'English' },
  },

  // Footer
  footer: {
    links: [
      {
        heading: 'Documentation',
        items: [
          { label: 'Getting Started', href: '/getting-started/' },
          { label: 'Components', href: '/components/' },
        ],
      },
      {
        heading: 'Resources',
        items: [
          { label: 'GitHub', href: 'https://github.com/agency/repo' },
        ],
      },
    ],
    // Optional contact info
    contact: {
      heading: 'Agency Contact Center',
      phone: '(800) 555-1234',
      email: 'info@agency.gov',
    },
    // Social media links (renders with icons)
    social: [
      { platform: 'facebook', href: 'https://facebook.com/agency' },
      { platform: 'x', href: 'https://x.com/agency' },
      { platform: 'youtube', href: 'https://youtube.com/@agency' },
      { platform: 'instagram', href: 'https://instagram.com/agency' },
      { platform: 'rss', href: '/feed.xml' },
    ],
  },

  // USWDS Identifier (required federal agency strip)
  identifier: {
    agency: 'Agency Name',
    agencyLogo: '/agency-logo.svg',
    parentAgency: {
      name: 'Parent Department',
      href: 'https://parent-agency.gov',
    },
    // Required links per federal policy
    links: [
      { label: 'About', href: '/about' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'FOIA Requests', href: '/foia' },
      { label: 'No FEAR Act', href: '/no-fear-act' },
      { label: 'Office of the Inspector General', href: '/oig' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'USA.gov', href: 'https://www.usa.gov/' },
    ],
  },

  // RSS feed (opt-in)
  rss: false,

  // Custom head tags
  head: [],

  // USWDS settings file path
  uswdsSettings: './src/styles/uswds-settings.scss',
}
```

## Success Criteria

1. A developer can scaffold a new docs site in under 5 minutes using the CLI
2. Content authors can add pages by creating markdown files — no config changes needed
3. The output site passes WCAG 2.1 AA automated checks (axe-core, pa11y)
4. The site is visually indistinguishable from a hand-built USWDS site
5. Build and deploy works on any static hosting platform with zero server-side dependencies
