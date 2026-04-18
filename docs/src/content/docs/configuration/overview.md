---
title: Configuration overview
description: The full option surface of the @red-glare/astro integration.
sidebar:
  order: 1
---

The integration is configured with a single options object passed to the `redGlare()` factory in `astro.config.mjs`. Every option is validated against a zod schema — mismatches fail the build with a clear error.

```js [astro.config.mjs]
import redGlare from '@red-glare/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://docs.example.gov',
  integrations: [
    redGlare({
      title: 'My Agency Docs',
      description: 'Official documentation for My Agency',
      governmentBanner: true,
      pagefind: true,
      rss: true,
      // ...
    }),
  ],
})
```

## Option reference

| Option | Type | Default | Docs |
| --- | --- | --- | --- |
| `title` | `string` | *required* | [Site metadata](/configuration/site-metadata/) |
| `description` | `string` | — | [Site metadata](/configuration/site-metadata/) |
| `logo` | `string` | — | [Site metadata](/configuration/site-metadata/) |
| `governmentBanner` | `boolean` | `true` | [Government banner](/configuration/government-banner/) |
| `alert` | `{ message, type, dismissible }` | — | [Government banner](/configuration/government-banner/) |
| `editLink` | `{ baseUrl }` | — | [Edit links](/configuration/edit-links/) |
| `sidebar` | `SidebarGroup[]` | auto | [Navigation](/configuration/navigation/) |
| `nav` | `NavItem[]` | auto from sidebar | [Navigation](/configuration/navigation/) |
| `footer` | `{ links, contact, social }` | — | [Footer & identifier](/configuration/footer-identifier/) |
| `identifier` | `{ agency, parentAgency, links, ... }` | — | [Footer & identifier](/configuration/footer-identifier/) |
| `pagefind` | `boolean` | `false` | [Search](/features/search/) |
| `rss` | `boolean` | `false` | [RSS](/features/rss/) |
| `llms` | `boolean` | `true` | [llms.txt](/features/llms-txt/) |
| `defaultLocale` | `string` | `"en"` | [i18n](/configuration/i18n/) |
| `locales` | `Record<string, { label }>` | — | [i18n](/configuration/i18n/) |
| `head` | `HeadTag[]` | `[]` | [Site metadata](/configuration/site-metadata/) |
| `uswdsSettings` | `string` | — | [Theming](/styling/theming/) |

## Where options are validated

`RedGlareConfigSchema` is defined in `packages/astro/src/config.ts`. The integration calls `schema.parse(userConfig)` on entry, so a missing `title` or a wrongly-typed `sidebar[].items` is caught before any build work happens — you see the failure in the terminal immediately.

## Re-exported types

The package exports TypeScript types for the config object — useful when you split the configuration across modules or pass it through a helper:

```ts
import type { RedGlareUserConfig } from '@red-glare/astro'

const config: RedGlareUserConfig = {
  title: 'My Agency Docs',
  governmentBanner: true,
}
```

`RedGlareUserConfig` is the input type (defaults not yet applied). `RedGlareConfig` is the parsed output. Most authors want the former.

## Next

:::link-button{href="/configuration/site-metadata/"}
Site metadata
:::

:::link-button{href="/configuration/navigation/" variant="outline"}
Navigation
:::
