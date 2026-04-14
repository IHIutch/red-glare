#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'

async function main(): Promise<void> {
  const { positionals } = parseArgs({ allowPositionals: true })
  const projectName = positionals[0]

  if (!projectName) {
    // eslint-disable-next-line no-console
    console.log('Usage: create-red-glare <project-name>\n\nExample:\n  npx create-red-glare my-agency-docs')
    process.exit(1)
  }

  const projectDir = resolve(process.cwd(), projectName)
  // eslint-disable-next-line no-console
  console.log(`\nCreating Stars and Stripes project in ${projectDir}...\n`)

  await mkdir(join(projectDir, 'src/content/docs'), { recursive: true })
  await mkdir(join(projectDir, 'src/styles'), { recursive: true })
  await mkdir(join(projectDir, 'public'), { recursive: true })

  // `@astrojs/preact` + `preact` ship alongside `@red-glare/astro`
  // because Astro's renderer resolver looks up the integration's server
  // entry point from the project cwd, not from the transitive dep
  // graph. Omitting them here would leave a scaffolded project unable
  // to hydrate its tab / code-group islands.
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
          '@astrojs/preact': '^5.1.1',
          '@red-glare/astro': '^0.0.1',
          'astro': '^6.0.0',
          'preact': '^10.29.1',
        },
      },
      null,
      2,
    )}\n`,
  )

  await writeFile(
    join(projectDir, 'astro.config.mjs'),
    `import { defineConfig } from 'astro/config'
import starsAndStripes from '@red-glare/astro'

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

  await writeFile(
    join(projectDir, 'src/content.config.ts'),
    `import { defineCollection } from 'astro:content'
import { docsLoader, docsSchema } from '@red-glare/astro/schema'

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema,
})

export const collections = { docs }
`,
  )

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

  await writeFile(
    join(projectDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        extends: 'astro/tsconfigs/strict',
        compilerOptions: {
          types: ['node'],
        },
      },
      null,
      2,
    )}\n`,
  )

  // eslint-disable-next-line no-console
  console.log(`Done! Next steps:\n\n  cd ${projectName}\n  pnpm install\n  pnpm dev\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
