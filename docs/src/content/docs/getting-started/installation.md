---
title: Installation
description: Install Red Glare into a new or existing Astro project.
sidebar:
  order: 1
---

Red Glare ships as two npm packages:

- [`@red-glare/astro`](https://www.npmjs.com/package/@red-glare/astro) — the Astro integration.
- [`@red-glare/create`](https://www.npmjs.com/package/@red-glare/create) — a scaffolder that bootstraps a ready-to-edit site.

## Prerequisites

- **Node.js** 20 or newer.
- **Astro** 6 (declared as a peer dependency — any existing Astro 6 project works).
- A package manager: `pnpm`, `npm`, or `yarn`.

## Scaffold a new site

The quickest way to get a working site is the `create` scaffolder. It writes an `astro.config.mjs`, `content.config.ts`, a welcome page, and a getting-started stub — everything the integration needs to boot.

::code-group
```bash [pnpm]
pnpm create @red-glare my-agency-docs
```
```bash [npm]
npm create @red-glare@latest my-agency-docs
```
```bash [yarn]
yarn create @red-glare my-agency-docs
```
::

Then install dependencies and start the dev server:

::code-group
```bash [pnpm]
cd my-agency-docs
pnpm install
pnpm dev
```
```bash [npm]
cd my-agency-docs
npm install
npm run dev
```
```bash [yarn]
cd my-agency-docs
yarn
yarn dev
```
::

The site boots at `http://localhost:4321`.

## Add Red Glare to an existing Astro project

If you already have an Astro 6 project, install the integration directly:

::code-group
```bash [pnpm]
pnpm add @red-glare/astro @astrojs/preact preact
```
```bash [npm]
npm install @red-glare/astro @astrojs/preact preact
```
```bash [yarn]
yarn add @red-glare/astro @astrojs/preact preact
```
::

::alert{type="info"}
  #heading
  ### Why install Preact directly?

  #body
  Red Glare auto-injects `@astrojs/preact` at `astro:config:setup`, but Astro's renderer resolver requires the Preact packages in your project root — not transitive dependencies. Install them alongside the integration.
::

Then wire up `astro.config.mjs`:

```js [astro.config.mjs]
import redGlare from '@red-glare/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://docs.example.gov',
  integrations: [
    redGlare({
      title: 'My Agency Docs',
    }),
  ],
})
```

And declare the content collection:

```ts [src/content.config.ts]
import { docsLoader, docsSchema } from '@red-glare/astro/schema'
import { defineCollection } from 'astro:content'

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema,
})

export const collections = { docs }
```

The loader globs `src/content/docs/**/*.md` by default. Drop a markdown file in there and you have a page.

## What the integration injects

On `astro:config:setup`, `@red-glare/astro`:

- Injects four prerender routes: `[...slug]`, `404`, and conditionally `feed.xml` + `[...slug].md` + `llms.txt`.
- Registers `@astrojs/preact` (compat mode) and `@astrojs/sitemap` — and `astro-pagefind` when `pagefind: true`.
- Wires a Vite virtual module at `virtual:red-glare/config` that the integration's routes read at build time.
- Adds the USWDS SCSS + CSS pipelines to Vite.
- Marks `@comark/react`, `comark`, and every `@fontsource-variable/*` package as `ssr.noExternal` so the CSS imports resolve correctly through Vite.

None of this requires configuration — it all runs when you add the integration to `integrations: []`.

## Next steps

:::link-button{href="/getting-started/project-structure/"}
Learn the project layout
:::

:::link-button{href="/getting-started/quickstart/" variant="outline"}
Write your first page
:::
