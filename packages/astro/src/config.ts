import { z } from "zod/v4";

const HeadTagSchema = z.object({
  tag: z.string(),
  attrs: z.record(z.string(), z.union([z.string(), z.boolean()])).optional(),
  content: z.string().optional(),
});

const SidebarLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const SidebarGroupSchema: z.ZodType<SidebarGroup> = z.object({
  label: z.string(),
  items: z
    .array(z.union([z.string(), z.lazy(() => SidebarGroupSchema)]))
    .optional(),
  autogenerate: z.object({ directory: z.string() }).optional(),
  collapsed: z.boolean().optional(),
});

interface SidebarGroup {
  label: string;
  items?: (string | SidebarGroup)[];
  autogenerate?: { directory: string };
  collapsed?: boolean;
}

const FooterLinkColumnSchema = z.object({
  heading: z.string(),
  items: z.array(z.object({ label: z.string(), href: z.string() })),
});

const SocialPlatformSchema = z.enum([
  "facebook",
  "x",
  "youtube",
  "instagram",
  "linkedin",
  "github",
  "rss",
]);

const IdentifierSchema = z.object({
  agency: z.string(),
  agencyLogo: z.string().optional(),
  parentAgency: z
    .object({
      name: z.string(),
      href: z.string(),
    })
    .optional(),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
});

export const StarsAndStripesConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  logo: z.string().optional(),

  governmentBanner: z.boolean().default(true),

  alert: z
    .object({
      message: z.string(),
      type: z
        .enum(["info", "warning", "error", "success"])
        .default("info"),
      dismissible: z.boolean().default(true),
    })
    .optional(),

  editLink: z
    .object({
      baseUrl: z.string(),
    })
    .optional(),

  sidebar: z.array(SidebarGroupSchema).optional(),

  pagefind: z.boolean().default(false),

  defaultLocale: z.string().default("en"),
  locales: z
    .record(z.string(), z.object({ label: z.string() }))
    .optional(),

  footer: z
    .object({
      links: z.array(FooterLinkColumnSchema).optional(),
      contact: z
        .object({
          heading: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
        })
        .optional(),
      social: z
        .array(
          z.object({
            platform: SocialPlatformSchema,
            href: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),

  identifier: IdentifierSchema.optional(),

  rss: z.boolean().default(false),

  head: z.array(HeadTagSchema).default([]),

  uswdsSettings: z.string().optional(),
});

export type StarsAndStripesConfig = z.infer<typeof StarsAndStripesConfigSchema>;
export type StarsAndStripesUserConfig = z.input<
  typeof StarsAndStripesConfigSchema
>;
