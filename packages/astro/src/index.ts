import type { AstroIntegration } from 'astro'

import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import pagefind from 'astro-pagefind'

import type { StarsAndStripesUserConfig } from './config'

import {
  StarsAndStripesConfigSchema,

} from './config'
import { copyUswdsImages, getUswdsViteConfig } from './integrations/uswds'
import { vitePluginVirtualConfig } from './integrations/virtual-config'

const FONTSOURCE_REGEX = /^@fontsource(?:-variable)?\//

export { extractSummaryText, parseContent } from './comark'
export type { StarsAndStripesConfig, StarsAndStripesUserConfig } from './config'
export { docsLoader } from './loader'
export type { DocsEntry, DocsFrontmatter } from './schema'
export { docsSchema } from './schema'

export default function starsAndStripes(
  userConfig: StarsAndStripesUserConfig,
): AstroIntegration {
  const config = StarsAndStripesConfigSchema.parse(userConfig)

  return {
    name: '@red-glare/astro',
    hooks: {
      'astro:config:setup': function ({
        injectRoute,
        updateConfig,
        config: astroConfig,
      }) {
        // Inject catch-all content route
        injectRoute({
          pattern: '[...slug]',
          entrypoint: new URL('./routes/[...slug].astro', import.meta.url)
            .pathname,
          prerender: true,
        })

        // Inject 404 route
        injectRoute({
          pattern: '404',
          entrypoint: new URL('./routes/404.astro', import.meta.url).pathname,
          prerender: true,
        })

        // Conditionally inject RSS feed route
        if (config.rss) {
          injectRoute({
            pattern: 'feed.xml',
            entrypoint: new URL('./routes/feed.xml.ts', import.meta.url)
              .pathname,
            prerender: true,
          })
        }

        // Conditionally inject raw .md endpoints and /llms.txt index
        if (config.llms) {
          injectRoute({
            pattern: '[...slug].md',
            entrypoint: new URL(
              './routes/[...slug].md.ts',
              import.meta.url,
            ).pathname,
            prerender: true,
          })
          injectRoute({
            pattern: 'llms.txt',
            entrypoint: new URL('./routes/llms.txt.ts', import.meta.url)
              .pathname,
            prerender: true,
          })
        }

        // Auto-inject integrations: React (for ComarkRenderer), Sitemap,
        // and optionally Pagefind
        const integrations: AstroIntegration[] = [preact({ compat: true }), sitemap()]

        if (config.pagefind) {
          integrations.push(pagefind())
        }

        const uswdsVite = getUswdsViteConfig()
        updateConfig({
          integrations,
          vite: {
            plugins: [
              vitePluginVirtualConfig(config, astroConfig),
              ...uswdsVite.plugins,
            ],
            ssr: {
              // Fontsource packages are CSS-only and need to flow through
              // Vite's CSS pipeline rather than Node's ESM loader on the SSR
              // side. Without this, Astro's dev server throws
              // ERR_UNKNOWN_FILE_EXTENSION on the layout's `.css` import.
              // The regex covers both `@fontsource/*` (static) and
              // `@fontsource-variable/*` namespaces.
              noExternal: [
                '@red-glare/astro',
                '@comark/react',
                'comark',
                FONTSOURCE_REGEX,
              ],
            },
            css: uswdsVite.css,
          },
        })
      },

      'astro:config:done': function () {
        // Reserved for post-config operations.
      },

      'astro:build:done': async function ({ dir }) {
        await copyUswdsImages(dir)
      },
    },
  }
}
