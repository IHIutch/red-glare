import { defineComarkPlugin } from 'comark/parse'
import { visit } from 'comark/utils'
import { z } from 'zod'

const ParameterSchema = z
  .object({
    name: z.string().min(1),
    type: z.string().min(1),
    required: z.boolean().optional(),
    default: z.union([z.string(), z.number(), z.boolean()]).optional(),
    enum: z.array(z.union([z.string(), z.number()])).optional(),
    description: z.string().optional(),
  })
  .strict()

const ResponseSchema = z
  .object({
    status: z.union([z.number(), z.string()]),
    description: z.string().optional(),
  })
  .strict()

export const EndpointAttrsSchema = z
  .object({
    method: z.string().min(1),
    path: z.string().min(1),
    id: z.string().optional(),
    deprecated: z.union([z.boolean(), z.string()]).optional(),
    pathParameters: z.array(ParameterSchema).optional(),
    queryParameters: z.array(ParameterSchema).optional(),
    headerParameters: z.array(ParameterSchema).optional(),
    bodyParameters: z.array(ParameterSchema).optional(),
    responses: z.array(ResponseSchema).optional(),
  })
  .strict()

export type EndpointAttrs = z.infer<typeof EndpointAttrsSchema>
export type Parameter = z.infer<typeof ParameterSchema>
export type Response = z.infer<typeof ResponseSchema>

/**
 * Validates the YAML-attribute payload on every `:::endpoint` block at
 * parse time. Authoring contract:
 *
 *     :::endpoint
 *     ---
 *     method: GET
 *     path: /repos/{owner}/{repo}/branches
 *     pathParameters:
 *       - name: owner
 *         type: string
 *         required: true
 *     responses:
 *       - status: 200
 *         description: Returns an array of branch objects.
 *     ---
 *
 *     ## List branches
 *
 *     Lists branches for the specified repository.
 *     :::
 *
 * Comark already parses the `---` block into structured attrs; this
 * plugin just runs zod over them so build pipelines surface bad shapes
 * (unknown keys, missing required fields, malformed parameters) at the
 * source instead of letting them silently render as `undefined` in the
 * client.
 */
export default defineComarkPlugin(() => ({
  name: 'endpoint',
  post: async (state) => {
    visit(
      state.tree,
      node => Array.isArray(node) && node[0] === 'endpoint',
      (node) => {
        if (!Array.isArray(node))
          return
        const rawAttrs = node[1] as Record<string, unknown>
        // Comark's token processor prefixes boolean-shaped attrs with
        // `:` (so `deprecated: true` arrives as `:deprecated: 'true'`).
        // Strip the prefix and coerce the value back to a real boolean
        // so authors can write idiomatic YAML and zod sees normal keys.
        const attrs: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(rawAttrs)) {
          if (key.startsWith(':')) {
            attrs[key.slice(1)] = value === 'true' || value === true
          }
          else {
            attrs[key] = value
          }
        }
        // Mutate the node so the React component sees the normalized shape.
        node[1] = attrs
        const result = EndpointAttrsSchema.safeParse(attrs)
        if (!result.success) {
          const issues = result.error.issues
            .map(i => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
            .join('\n')
          throw new Error(
            `:::endpoint block failed validation (method=${attrs.method ?? '?'} path=${attrs.path ?? '?'}):\n${issues}`,
          )
        }
      },
    )
  },
}))
