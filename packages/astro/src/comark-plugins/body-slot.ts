import { defineComarkPlugin } from 'comark/parse'
import { visit } from 'comark/utils'

/**
 * Aliases the `#body` named slot to comark's built-in `#default` slot.
 *
 * Comark's MDC slot syntax requires authors to wrap "everything that
 * isn't a named slot" in a `#default` marker whenever a named slot
 * (e.g. `#heading`) appears earlier in the directive — otherwise the
 * named slot greedily consumes the rest of the directive body. The
 * literal name `default` reads as an internal/technical marker, so
 * we accept the friendlier alias `#body` and rewrite it to `default`
 * before `@comark/react`'s renderer sees the tree (the renderer
 * special-cases `default` to become the React `children` prop, so the
 * rename gives `#body` the same behavior with no other plumbing).
 */
export default defineComarkPlugin(() => ({
  name: 'body-slot',
  post: async (state) => {
    visit(
      state.tree,
      node => Array.isArray(node) && node[0] === 'template' && (node[1] as { name?: string })?.name === 'body',
      (node) => {
        if (Array.isArray(node)) {
          (node[1] as { name?: string }).name = 'default'
        }
      },
    )
  },
}))
