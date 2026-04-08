import type { AstroIntegration } from "astro";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import {
  StarsAndStripesConfigSchema,
  type StarsAndStripesUserConfig,
} from "./config.js";
import { vitePluginVirtualConfig } from "./integrations/virtual-config.js";
import { getUswdsViteConfig } from "./integrations/uswds.js";

export type { StarsAndStripesConfig, StarsAndStripesUserConfig } from "./config.js";
export type { DocsFrontmatter } from "./schema.js";
export { docsLoader } from "./loader.js";
export { docsSchema } from "./schema.js";
export { parseContent } from "./comark.js";

export default function starsAndStripes(
  userConfig: StarsAndStripesUserConfig,
): AstroIntegration {
  const config = StarsAndStripesConfigSchema.parse(userConfig);

  return {
    name: "@starsandstripes/astro",
    hooks: {
      "astro:config:setup"({
        injectRoute,
        updateConfig,
        config: astroConfig,
      }) {
        // Inject catch-all content route
        injectRoute({
          pattern: "[...slug]",
          entrypoint: new URL("./routes/[...slug].astro", import.meta.url)
            .pathname,
          prerender: true,
        });

        // Inject 404 route
        injectRoute({
          pattern: "404",
          entrypoint: new URL("./routes/404.astro", import.meta.url).pathname,
          prerender: true,
        });

        // Conditionally inject RSS feed route
        if (config.rss) {
          injectRoute({
            pattern: "feed.xml",
            entrypoint: new URL("./routes/feed.xml.ts", import.meta.url)
              .pathname,
            prerender: true,
          });
        }

        // USWDS SCSS configuration
        const uswdsViteConfig = getUswdsViteConfig(
          astroConfig.root.pathname,
          config.uswdsSettings,
        );

        // Auto-inject integrations: React, Sitemap, and optionally Pagefind
        const integrations: AstroIntegration[] = [react(), sitemap()];

        if (config.pagefind) {
          integrations.push(pagefind());
        }

        updateConfig({
          integrations,
          vite: {
            plugins: [vitePluginVirtualConfig(config, astroConfig)],
            ...uswdsViteConfig,
          },
        });
      },

      "astro:config:done"() {
        // Reserved for post-config operations
      },

      "astro:build:done"() {
        // Reserved for Pagefind indexing
      },
    },
  };
}
