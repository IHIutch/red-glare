---
title: Getting Started
description: How to install and configure Stars and Stripes
sidebar:
  order: 1
toc: false
---

## Installation

Install the package using your preferred package manager:

::code-group
```bash [pnpm]
pnpm add @starsandstripes/astro
```
```bash [npm]
npm install @starsandstripes/astro
```
```bash [yarn]
yarn add @starsandstripes/astro
```
::

## Configuration

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import starsAndStripes from '@starsandstripes/astro'

export default defineConfig({
  integrations: [
    starsAndStripes({
      title: 'My Agency Docs',
    }),
  ],
})
```

## Content Collections

Create a `src/content.config.ts` file:

```typescript
import { defineCollection } from 'astro:content'
import { docsLoader, docsSchema } from '@starsandstripes/astro/schema'

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema,
})

export const collections = { docs }
```

## Adding Pages

Create markdown files in `src/content/docs/`:

```markdown
---
title: My Page
description: A description of my page
sidebar:
  order: 1
---

Your content here.
```

::alert{type="info"}
Pages are automatically added to the sidebar based on file structure.
::
