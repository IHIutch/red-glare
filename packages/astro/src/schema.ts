import { z } from 'zod/v4'

export { docsLoader } from './loader'

export const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  template: z.enum(['doc', 'splash', 'api']).default('doc'),
  sidebar: z
    .object({
      label: z.string().optional(),
      order: z.number().optional(),
      hidden: z.boolean().default(false),
    })
    .optional(),
  toc: z.boolean().default(true),
  /**
   * Version string rendered as a small pill next to the `<h1>` on
   * `template: 'api'` pages (e.g. `"2026-03-10"` → `v2026-03-10`).
   * Ignored on other templates.
   */
  apiVersion: z.string().optional(),
  /**
   * Reserved for a future toggle that prefixes endpoint signature
   * paths with the full base URL. Defined in v1 so adding that
   * behavior later doesn't break schema validation.
   */
  apiBaseUrl: z.string().optional(),
  i18n: z
    .object({
      lang: z.string().optional(),
    })
    .optional(),
  draft: z.boolean().default(false),
})

export type DocsFrontmatter = z.infer<typeof docsSchema>

/**
 * Shape of a content collection entry using `docsSchema`. This mirrors
 * Astro's `CollectionEntry` type but is resolvable inside the integration
 * package (where `CollectionEntry<"docs">` isn't available because the
 * collection name lives in the user's content config, not the library).
 */
export interface DocsEntry {
  id: string
  body?: string
  data: DocsFrontmatter
  filePath?: string
}
