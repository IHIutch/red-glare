---
title: Project structure
description: What the files in a Red Glare project do and how they fit together.
sidebar:
  order: 2
---

A Red Glare project is a normal Astro project with two integration-specific files: `astro.config.mjs` (where you register the integration) and `src/content.config.ts` (where you declare the docs collection). Everything else is content.

## Minimal layout

```
my-agency-docs/
├── package.json
├── astro.config.mjs            # Red Glare integration + options
├── tsconfig.json
├── public/                     # Static assets served verbatim
├── src/
│   ├── content.config.ts       # docsLoader + docsSchema
│   ├── content/
│   │   └── docs/               # Every .md file here becomes a page
│   │       ├── index.md        # → /
│   │       ├── getting-started.md   # → /getting-started/
│   │       └── guides/
│   │           └── setup.md    # → /guides/setup/
│   └── styles/
│       └── uswds-settings.scss  # Optional — customize USWDS tokens
└── wrangler.jsonc              # Optional — Cloudflare Workers deploy
```

## What each file does

### `astro.config.mjs`

Registers the integration and passes its options object. This is the single source of truth for site metadata, navigation, footer, identifier, and feature toggles.

```js [astro.config.mjs]
import redGlare from '@red-glare/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://docs.example.gov',
  integrations: [redGlare({ title: 'My Agency Docs' })],
})
```

See [Configuration overview](/configuration/overview/) for the full option list.

### `src/content.config.ts`

Declares an Astro content collection named `docs`. The `docsLoader()` globs `./src/content/docs/**/*.md`; the `docsSchema` validates frontmatter and fails the build on missing fields.

```ts [src/content.config.ts]
import { docsLoader, docsSchema } from '@red-glare/astro/schema'
import { defineCollection } from 'astro:content'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema,
  }),
}
```

See [Frontmatter](/authoring/frontmatter/) for the schema reference.

### `src/content/docs/`

Every `.md` file in this directory (and its subdirectories) becomes a page. File path → URL path:

| File | URL |
| --- | --- |
| `index.md` | `/` |
| `about.md` | `/about/` |
| `guides/setup.md` | `/guides/setup/` |
| `guides/index.md` | `/guides/` |

Directories become sidebar groups. The group label is auto-titlecased from the directory name.

### `public/`

Standard Astro public directory. Files here are served verbatim at the site root — use it for favicons, `robots.txt`, agency logos, and other static assets the USWDS header or identifier references.

### `src/styles/uswds-settings.scss` (optional)

Point `uswdsSettings` at this file in `astro.config.mjs` to override USWDS tokens (theme colors, fonts, spacing). See [Theming](/styling/theming/).

## How URLs are generated

Red Glare injects a single catch-all route — `[...slug].astro` — that matches every entry in the `docs` collection. Astro's content collection IDs map to pretty URLs with trailing slashes (`astro build` default). A file at `src/content/docs/guides/setup.md` with frontmatter `title: "Setup Guide"` ships as `/guides/setup/`.

::alert{type="info"}
The slug comes from the file path, not the frontmatter. Rename files, not titles, to change URLs.
::

## Where to go next

:::link-button{href="/getting-started/quickstart/"}
Write your first page
:::

:::link-button{href="/configuration/overview/" variant="outline"}
Configure the site
:::
