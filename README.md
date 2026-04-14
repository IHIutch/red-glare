# Red Glare

A reusable Astro integration for building [USWDS](https://designsystem.digital.gov/)-styled federal documentation sites. Content is authored in CommonMark + Comark directives; chrome is composed from real `@uswds/uswds` components, so every site doubles as a reference implementation of the design system.

## Features

- **USWDS site chrome** — government banner, header (with megamenu nav), sidenav, footer, identifier, breadcrumbs, in-page navigation, and 404 page composed from real `@uswds/uswds` components
- **Comark content pipeline** — CommonMark with directive components (`::alert`, `:::accordion`, `::code-group`, `:::process-list`, `:::summary-box`, `:::endpoint`, …) and shiki syntax highlighting baked in at parse time
- **API reference template** — `template: api` pages with a `:::endpoint` directive whose YAML attributes (method, path, parameters, responses) are validated by zod at parse time and rendered as a two-column GitHub-style layout with `#request` / `#response` slots
- **Auto-generated sidebar** with config + frontmatter overrides (Starlight-style hybrid model)
- **Build-time link validator** that resolves every internal `[text](/path)` and `#anchor` against the parsed content tree and fails the build on broken links
- **SEO + feeds** — Open Graph, Twitter cards, canonical URLs, sitemap, opt-in RSS feed, opt-in `llms.txt` index, and per-page `.md` source endpoint
- **Pagefind search** — opt-in client-side full-text search wired into the USWDS search input
- **i18n** — locale-folder routing with auto-generated language switcher
- **Accessibility** — WCAG 2.1 AA by default, inheriting from USWDS components plus tested keyboard / ARIA behavior on every interactive island

## Installation

```bash
pnpm add @red-glare/astro
# or
npm install @red-glare/astro
```

The integration peer-depends on `astro@^6` and ships its own copies of `@astrojs/preact`, `preact`, `@uswds/uswds`, and `comark`.

## Quick start

```js
// astro.config.mjs
import redGlare from '@red-glare/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://docs.example.gov',
  integrations: [
    redGlare({
      title: 'Agency Documentation',
      description: 'Official documentation for Agency X',
      governmentBanner: true,
      nav: [
        { label: 'Getting Started', href: '/getting-started/' },
        {
          label: 'Reference',
          items: [
            { label: 'Components', href: '/components/' },
            { label: 'Configuration', href: '/configuration/' },
          ],
        },
      ],
    }),
  ],
})
```

```ts
// src/content.config.ts
import { docsLoader, docsSchema } from '@red-glare/astro/schema'
import { defineCollection } from 'astro:content'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema,
  }),
}
```

Drop markdown into `src/content/docs/` and run `astro dev`.

### Scaffold a new project

```bash
pnpm create @red-glare my-agency-docs
cd my-agency-docs
pnpm install
pnpm dev
```

## Repository layout

```
packages/astro/   # @red-glare/astro — the integration
packages/create/  # @red-glare/create — CLI scaffolder
demo/             # Working example site exercising every component
```

## Development

```bash
pnpm install
pnpm --filter @red-glare/astro test       # browser tests via @vitest/browser + Playwright
pnpm --filter @red-glare/astro typecheck
pnpm lint
pnpm --filter red-glare-demo dev          # run the demo site locally
```

## License

MIT
