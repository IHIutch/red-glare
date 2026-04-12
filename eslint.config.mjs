import antfu from '@antfu/eslint-config'

import noTemplateTrailingWhitespace from './eslint-rules/no-template-trailing-whitespace.js'

const localPlugin = {
  rules: {
    'no-template-trailing-whitespace': noTemplateTrailingWhitespace,
  },
}

export default antfu(
  {
    typescript: true,
    react: true,
    astro: true,
    markdown: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    plugins: {
      local: localPlugin,
    },
    rules: {
      'perfectionist/sort-imports': ['error', {
        type: 'natural',
      }],
      // Flag (and auto-fix) whitespace before the closing backtick of a
      // multi-line template literal. Such whitespace becomes part of the
      // literal value and breaks multi-line fixtures like markdown
      // rendered via renderComark(md`...`).
      'local/no-template-trailing-whitespace': 'error',
    },
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.astro/**',
      '**/.beads/**',
      '**/*.md',
      'pnpm-lock.yaml',
    ],
  },
)
