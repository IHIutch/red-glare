#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

const { positionals } = parseArgs({
  allowPositionals: true,
})

const projectName = positionals[0]

if (!projectName) {
  console.log('Usage: create-starsandstripes <project-name>')
  console.log('')
  console.log('Example:')
  console.log('  npx create-starsandstripes my-agency-docs')
  process.exit(1)
}

const projectDir = resolve(process.cwd(), projectName)

console.log(`\nCreating Stars and Stripes project in ${projectDir}...\n`)

// Create directory structure
await mkdir(join(projectDir, 'src/content/docs'), { recursive: true })
await mkdir(join(projectDir, 'src/styles'), { recursive: true })
await mkdir(join(projectDir, 'public'), { recursive: true })

// package.json
await writeFile(
  join(projectDir, 'package.json'),
  `${JSON.stringify(
    {
      name: projectName,
      version: '0.0.1',
      private: true,
      type: 'module',
      scripts: {
        dev: 'astro dev',
        build: 'astro build',
        preview: 'astro preview',
      },
      dependencies: {
        '@starsandstripes/astro': '^0.0.1',
        'astro': '^6.0.0',
      },
    },
    null,
    2,
  )}\n`,
)

// astro.config.mjs
await writeFile(
  join(projectDir, 'astro.config.mjs'),
  `import { defineConfig } from 'astro/config'
import starsAndStripes from '@starsandstripes/astro'

export default defineConfig({
  integrations: [
    starsAndStripes({
      title: '${projectName}',
      description: 'Documentation site powered by Stars and Stripes',
      governmentBanner: true,
    }),
  ],
})
`,
)

// content.config.ts
await writeFile(
  join(projectDir, 'src/content.config.ts'),
  `import { defineCollection } from 'astro:content'
import { docsLoader, docsSchema } from '@starsandstripes/astro/schema'

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema,
})

export const collections = { docs }
`,
)

// Index page
await writeFile(
  join(projectDir, 'src/content/docs/index.md'),
  `---
title: Welcome
description: Getting started with your documentation site.
template: splash
---

Welcome to your new documentation site, powered by [Stars and Stripes](https://github.com/starsandstripes).

## Getting Started

Edit this file at \`src/content/docs/index.md\` to get started.

Add new pages by creating markdown files in \`src/content/docs/\`.
`,
)

// Example docs page
await writeFile(
  join(projectDir, 'src/content/docs/getting-started.md'),
  `---
title: Getting Started
description: How to set up and use this documentation site.
sidebar:
  order: 1
---

## Installation

Your documentation site is already set up and ready to go.

## Adding Pages

Create new \`.md\` files in \`src/content/docs/\` and they will automatically appear in the sidebar.

## Frontmatter

Each page supports frontmatter for metadata:

\`\`\`yaml
---
title: Page Title
description: Brief description
sidebar:
  label: Custom Label
  order: 1
toc: true
---
\`\`\`
`,
)

// tsconfig.json
await writeFile(
  join(projectDir, 'tsconfig.json'),
  `${JSON.stringify(
    {
      extends: 'astro/tsconfigs/strict',
    },
    null,
    2,
  )}\n`,
)

console.log('Done! Next steps:\n')
console.log(`  cd ${projectName}`)
console.log('  pnpm install')
console.log('  pnpm dev\n')
