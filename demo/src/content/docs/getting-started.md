---
title: Getting Started
description: How to install and configure Red Glare
sidebar:
  order: 1
toc: false
---

## Installation

Install the package using your preferred package manager:

::code-group
```bash [pnpm]
pnpm add @red-glare/astro
```
```bash [npm]
npm install @red-glare/astro
```
```bash [yarn]
yarn add @red-glare/astro
```
::

## Configuration

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import redGlare from '@red-glare/astro'

export default defineConfig({
  integrations: [
    redGlare({
      title: 'My Agency Docs',
    }),
  ],
})
```

## Content Collections

Create a `src/content.config.ts` file:

```typescript
import { defineCollection } from 'astro:content'
import { docsLoader, docsSchema } from '@red-glare/astro/schema'

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
