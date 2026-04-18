import { docsLoader, docsSchema } from '@red-glare/astro/schema'
import { defineCollection } from 'astro:content'

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema,
})

export const collections = { docs }
