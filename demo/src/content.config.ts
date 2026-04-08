import { defineCollection } from 'astro:content'
import { docsLoader, docsSchema } from '@starsandstripes/astro/schema'

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema,
})

export const collections = { docs }
