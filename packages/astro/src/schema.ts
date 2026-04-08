import { z } from "zod/v4";
export { docsLoader } from "./loader.js";

export const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  template: z.enum(["doc", "splash"]).default("doc"),
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
});

export type DocsFrontmatter = z.infer<typeof docsSchema>;
