# @red-glare/astro

> Astro integration for building [USWDS](https://designsystem.digital.gov/)-styled federal documentation sites with [Comark](https://comark.dev).

Real `@uswds/uswds` site chrome (government banner, header, sidenav, footer, identifier, breadcrumbs, in-page nav, 404), CommonMark + directive content (`::alert`, `:::accordion`, `::code-group`, `:::process-list`, `:::summary-box`, `:::endpoint`), shiki syntax highlighting baked in at parse time, build-time link validation, opt-in Pagefind search, RSS / `llms.txt` / per-page `.md` feeds, and i18n.

## Install

```bash
pnpm add @red-glare/astro
# or
npm install @red-glare/astro
```

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

See the [main README](https://github.com/red-glare/red-glare#readme) for the full feature list and configuration reference.

## License

MIT
