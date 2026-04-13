import type { IconData } from './icon-data.js'

import { getVscodeIcon } from './icons.js'

// Ported from Nuxt UI's `src/theme/prose/code-icon.ts` — a single flat map
// that mixes full filenames, bare command/tool names, and raw file
// extensions. Resolution order (matching Nuxt's `CodeIcon.vue`):
//   1. full basename (lowercased)
//   2. raw extension (lowercased, last dot segment)
//   3. dynamic fallback: `file-type-${ext}` in the vscode-icons set
// Values are vscode-icons names (Nuxt's `i-vscode-icons-file-type-*` prefix
// stripped). `terminal` is remapped to `file-type-shell` since Nuxt uses
// `i-lucide-terminal` which would require pulling in a second icon set.
const ICON_MAP: Record<string, string> = {
  'package.json': 'file-type-node',
  'tsconfig.json': 'file-type-tsconfig',
  '.npmrc': 'file-type-npm',
  '.editorconfig': 'file-type-editorconfig',
  '.eslintrc': 'file-type-eslint',
  '.eslintrc.cjs': 'file-type-eslint',
  '.eslintignore': 'file-type-eslint',
  'eslint.config.js': 'file-type-eslint',
  'eslint.config.mjs': 'file-type-eslint',
  'eslint.config.cjs': 'file-type-eslint',
  '.gitignore': 'file-type-git',
  'yarn.lock': 'file-type-yarn',
  '.env': 'file-type-dotenv',
  '.env.example': 'file-type-dotenv',
  '.vscode/settings.json': 'file-type-vscode',
  'nuxt': 'file-type-nuxt',
  '.nuxtrc': 'file-type-nuxt',
  '.nuxtignore': 'file-type-nuxt',
  'nuxt.config.js': 'file-type-nuxt',
  'nuxt.config.ts': 'file-type-nuxt',
  'nuxt.schema.ts': 'file-type-nuxt',
  'tailwind.config.js': 'file-type-tailwind',
  'tailwind.config.ts': 'file-type-tailwind',
  'vue': 'file-type-vue',
  'ts': 'file-type-typescript',
  'tsx': 'file-type-typescript',
  'mjs': 'file-type-js-official',
  'cjs': 'file-type-js-official',
  'js': 'file-type-js-official',
  'jsx': 'file-type-js-official',
  'md': 'file-type-markdown',
  'py': 'file-type-python',
  'cs': 'file-type-csharp',
  'asm': 'file-type-assembly',
  'f': 'file-type-fortran',
  'hs': 'file-type-haskell',
  'fs': 'file-type-fsharp',
  'kt': 'file-type-kotlin',
  'rs': 'file-type-rust',
  'rb': 'file-type-ruby',
  'lsp': 'file-type-lisp',
  'ps1': 'file-type-powershell',
  'psd1': 'file-type-powershell',
  'psm1': 'file-type-powershell',
  'go': 'file-type-go',
  'gleam': 'file-type-gleam',
  'bicep': 'file-type-bicep',
  'bicepparam': 'file-type-bicep',
  'exs': 'file-type-elixir',
  'erl': 'file-type-erlang',
  'sbt': 'file-type-scala',
  'h': 'file-type-cppheader',
  'ino': 'file-type-arduino',
  'pl': 'file-type-perl',
  'jl': 'file-type-julia',
  'dart': 'file-type-dartlang',
  'ico': 'file-type-favicon',
  'npm': 'file-type-npm',
  // vscode-icons ships two pnpm variants: the default `file-type-pnpm`
  // uses a white fill (for dark IDE themes) and `file-type-light-pnpm`
  // uses a dark gray fill. Our docs run on a light background, so we
  // want the dark-filled variant.
  'pnpm': 'file-type-light-pnpm',
  'npx': 'file-type-npm',
  'yarn': 'file-type-yarn',
  'bun': 'file-type-bun',
  'deno': 'file-type-deno',
  'yml': 'file-type-yaml',
  'terminal': 'file-type-shell',
}

// Pattern-based matches for config files whose icon is project-specific
// rather than language-specific. Each pattern is checked after the exact
// basename lookup (which wins for things like `package.json` that have
// their own entry in ICON_MAP) and before the extension fallback.
// Patterns are matched in order — put more specific entries first if
// they could overlap.
//
// Icons target a light UI background (our docs run on white), so we
// prefer `file-type-light-*` variants whenever vscode-icons ships one.
// For tools with only a single color variant, `file-type-<tool>` is
// used as-is.
const PATTERN_ICONS: Array<[RegExp, string]> = [
  [/^astro\.config\.[cm]?[jt]s$/, 'file-type-light-astro'],
  [/^vite\.config\.[cm]?[jt]s$/, 'file-type-light-vite'],
  [/^vitest\.config\.[cm]?[jt]s$/, 'file-type-light-vite'],
  [/^rollup\.config\.[cm]?[jt]s$/, 'file-type-rollup'],
  [/^webpack\.config\.[cm]?[jt]s$/, 'file-type-webpack'],
  [/^svelte\.config\.[cm]?[jt]s$/, 'file-type-svelte'],
  [/^next\.config\.[cm]?[jt]s$/, 'file-type-light-next'],
  [/^gatsby-config\.[cm]?[jt]s$/, 'file-type-gatsby'],
  [/^playwright\.config\.[cm]?[jt]s$/, 'file-type-playwright'],
  [/^prettier\.config\.[cm]?[jt]s$/, 'file-type-light-prettier'],
  [/^\.prettierrc(\.[cm]?[jt]s|\.json5?|\.ya?ml|\.toml)?$/, 'file-type-light-prettier'],
  [/^biome\.jsonc?$/, 'file-type-biome'],
  [/^tauri\.conf\.json$/, 'file-type-tauri'],
  [/^bun\.lock(b)?$/, 'file-type-bun'],
  [/^deno\.jsonc?$/, 'file-type-light-deno'],
]

// Strip trailing parenthetical annotations like "app.tsx (client)" so the
// bare filename drives the icon lookup.
const TRAILING_PARENS_RE = /\s*\(.*\)\s*$/

export function getLangIcon(filename: string): IconData | null {
  const cleaned = filename.trim().replace(TRAILING_PARENS_RE, '')
  if (!cleaned)
    return null

  const name = cleaned.split('/').pop()?.toLowerCase()
  if (!name)
    return null

  // 1. Exact basename match (covers `package.json`, `.env`, etc.)
  const byName = ICON_MAP[name]
  if (byName) {
    const icon = getVscodeIcon(byName)
    if (icon)
      return icon
  }

  // 2. Pattern match (covers `astro.config.{js,mjs,ts,cjs,mts,cts}`, etc.)
  for (const [pattern, iconName] of PATTERN_ICONS) {
    if (pattern.test(name)) {
      const icon = getVscodeIcon(iconName)
      if (icon)
        return icon
    }
  }

  if (!name.includes('.'))
    return null

  // 3. Extension lookup (curated, prefers `-official` variants etc.)
  const ext = name.split('.').pop()!
  const mapped = ICON_MAP[ext]
  if (mapped) {
    const icon = getVscodeIcon(mapped)
    if (icon)
      return icon
  }

  // 4. Dynamic fallback — try `file-type-${ext}` directly.
  return getVscodeIcon(`file-type-${ext}`)
}
