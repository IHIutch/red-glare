/**
 * @fileoverview Disallow whitespace before the closing backtick of a
 *   multi-line template literal. Such whitespace becomes part of the
 *   literal value at runtime, which breaks indentation-sensitive content
 *   (markdown fixtures, YAML, raw HTML) and corrupts syntax highlighting
 *   inside the editor.
 *
 *   ✗ bad:
 *     const x = md`
 *       content
 *         `   ← the spaces before the backtick end up in the rendered string
 *
 *   ✓ good:
 *     const x = md`
 *       content
 *     `       ← closing backtick sits at column 0 of its own line
 */

const TRAILING_WHITESPACE = /\n([ \t]+)$/

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    fixable: 'whitespace',
    docs: {
      description:
        'Disallow whitespace before the closing backtick of a multi-line '
        + 'template literal',
    },
    messages: {
      trailingWhitespace:
        'Template literal closing backtick should sit at column 0 of its '
        + 'own line. Leading whitespace becomes part of the literal value '
        + 'and breaks multi-line content (markdown fixtures, etc.).',
    },
    schema: [],
  },
  create(context) {
    return {
      TemplateElement(node) {
        // Only check the FINAL element of a template literal (the one
        // immediately before the closing backtick). Intermediate elements
        // sit between `${` and the next `}` where trailing whitespace
        // could be intentional formatting.
        if (!node.tail)
          return

        const raw = node.value.raw
        const match = raw.match(TRAILING_WHITESPACE)
        if (!match)
          return

        const whitespace = match[1]

        // Compute the range of the whitespace in the source text. We can't
        // rely on `node.range[1]` directly because different parsers place
        // the closing backtick inside or outside the node's range — using
        // the source text and indexOf keeps the fix correct regardless.
        const sourceCode = context.sourceCode ?? context.getSourceCode()
        const nodeText = sourceCode.getText(node)
        const whitespaceIndex = nodeText.lastIndexOf(`\n${whitespace}`) + 1
        const absoluteStart = node.range[0] + whitespaceIndex
        const absoluteEnd = absoluteStart + whitespace.length

        context.report({
          node,
          messageId: 'trailingWhitespace',
          fix(fixer) {
            return fixer.removeRange([absoluteStart, absoluteEnd])
          },
        })
      },
    }
  },
}
