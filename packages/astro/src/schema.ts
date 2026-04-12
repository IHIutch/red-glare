import { z } from 'zod/v4'

export { docsLoader } from './loader.js'

export const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  template: z.enum(['doc', 'splash']).default('doc'),
  sidebar: z
    .object({
      label: z.string().optional(),
      order: z.number().optional(),
      hidden: z.boolean().default(false),
    })
    .optional(),
  toc: z.boolean().default(true),
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
