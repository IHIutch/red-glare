// @ts-nocheck — this file runs in Astro's context, not standalone tsc
// RSS feed route — only active when rss: true in config
// Injected conditionally by the integration
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  // Import config at runtime via virtual module
  const { default: config } = await import("virtual:starsandstripes/config");

  const docs = await getCollection("docs", (entry) => !entry.data.draft);

  return rss({
    title: config.title,
    description: config.description ?? "",
    site: context.site?.toString() ?? "http://localhost",
    items: docs.map((doc) => ({
      title: doc.data.title,
      description: doc.data.description ?? "",
      link: `/${doc.id}/`,
    })),
  });
}
