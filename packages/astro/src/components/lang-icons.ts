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
  'mjs': 'file-type-js',
  'cjs': 'file-type-js',
  'js': 'file-type-js',
  'jsx': 'file-type-js',
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
  'pnpm': 'file-type-pnpm',
  'npx': 'file-type-npm',
  'yarn': 'file-type-yarn',
  'bun': 'file-type-bun',
  'deno': 'file-type-deno',
  'yml': 'file-type-yaml',
  'terminal': 'file-type-shell',
}

export function getLangIcon(filename: string): IconData | null {
  const cleaned = filename.trim().replace(/\s*\(.*\)\s*$/, '')
  if (!cleaned)
    return null

  const name = cleaned.split('/').pop()?.toLowerCase()
  if (!name)
    return null

  const byName = ICON_MAP[name]
  if (byName) {
    const icon = getVscodeIcon(byName)
    if (icon)
      return icon
  }

  if (!name.includes('.'))
    return null

  const ext = name.split('.').pop()!
  const mapped = ICON_MAP[ext]
  if (mapped) {
    const icon = getVscodeIcon(mapped)
    if (icon)
      return icon
  }

  return getVscodeIcon(`file-type-${ext}`)
}
