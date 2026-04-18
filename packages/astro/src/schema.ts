import { z } from 'zod/v4'

export { docsLoader } from './loader'

const HeroActionSchema = z.object({
  text: z.string(),
  link: z.string(),
  /**
   * USWDS button variant modifier. Omit for the default primary button.
   * Mirrors `LinkButton`'s variant prop — any of the USWDS `usa-button--*`
   * suffixes except `primary` (the implicit default).
   */
  variant: z
    .enum(['secondary', 'accent-cool', 'accent-warm', 'base', 'outline', 'inverse'])
    .optional(),
  /** Add `usa-button--outline` on top of the variant. */
  outline: z.boolean().optional(),
  /** Render as the `big` USWDS button variant. */
  big: z.boolean().optional(),
  /**
   * External link — opens in a new tab with `rel="noopener noreferrer"`.
   * Leave unset for same-origin or same-tab navigation.
   */
  external: z.boolean().optional(),
})

const HeroSchema = z.object({
  /** Main headline. Renders as the page's `<h1>`. */
  text: z.string(),
  /** Optional lede / tagline paragraph below the headline. */
  tagline: z.string().optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  actions: z.array(HeroActionSchema).optional(),
})

const FeatureSchema = z.object({
  /** Emoji or text rendered above the title. Not icon-font — keep it simple. */
  icon: z.string().optional(),
  title: z.string(),
  details: z.string(),
  /** Optional call-to-action link wired into the card footer. */
  link: z.string().optional(),
  /**
   * Call-to-action text. Required when `link` is set — a generic "Learn
   * more" repeated across every card is a weaker signal than specific
   * verbs ("Read the config reference", "See components", …), so the
   * schema forces authors to pick one.
   */
  linkText: z.string().optional(),
})

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
   * Splash-template hero block. Rendered above the page body in a dark
   * USWDS band. Ignored on `doc` and `api` templates.
   */
  hero: HeroSchema.optional(),
  /**
   * Splash-template features grid. Rendered below the hero (or at the
   * top of the page when no hero is set). Ignored on other templates.
   */
  features: z.array(FeatureSchema).optional(),
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
