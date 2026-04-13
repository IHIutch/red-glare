import type { IconData } from './icon-data.js'

import logosSet from '@iconify-json/logos/icons.json' with { type: 'json' }
import lucideSet from '@iconify-json/lucide/icons.json' with { type: 'json' }
import vscodeIconsSet from '@iconify-json/vscode-icons/icons.json' with { type: 'json' }

export type { IconData }

interface RawIconSet {
  width?: number
  height?: number
  icons: Record<string, { body: string, width?: number, height?: number }>
}

// Installed Iconify collections, keyed by the prefix used in `i-{set}-{name}`
// references (matching Nuxt UI's Iconify shorthand). Adding a new set is a
// two-line change: install `@iconify-json/<name>` and register it here.
const SETS: Record<string, RawIconSet> = {
  'lucide': lucideSet as RawIconSet,
  'logos': logosSet as RawIconSet,
  'vscode-icons': vscodeIconsSet as RawIconSet,
}

function fromSet(set: RawIconSet, name: string): IconData | null {
  const raw = set.icons[name]
  if (!raw)
    return null
  return {
    body: raw.body,
    width: raw.width ?? set.width ?? 16,
    height: raw.height ?? set.height ?? 16,
  }
}

/**
 * Resolve an Iconify-style icon reference like `i-lucide-eye` or
 * `i-vscode-icons-file-type-typescript-official` into renderable data.
 *
 * The `i-` prefix is optional (Nuxt UI convention strips it internally).
 * The longest matching registered collection prefix wins so that
 * `vscode-icons` beats `vscode`, etc.
 *
 * Returns `null` if the reference doesn't match any installed set or
 * the named icon doesn't exist in that set.
 */
export function resolveIconByName(reference: string): IconData | null {
  const cleaned = reference.replace(/^i-/, '')
  if (!cleaned)
    return null

  let bestSetKey: string | null = null
  for (const key of Object.keys(SETS)) {
    const prefix = `${key}-`
    if (cleaned.startsWith(prefix)) {
      if (!bestSetKey || key.length > bestSetKey.length)
        bestSetKey = key
    }
  }

  if (!bestSetKey)
    return null

  const iconName = cleaned.slice(bestSetKey.length + 1)
  return fromSet(SETS[bestSetKey], iconName)
}

/**
 * Lookup an icon by bare name inside a specific set. Used by
 * `getLangIcon` to hit vscode-icons without going through the
 * `i-{set}-{name}` dispatcher.
 */
export function getVscodeIcon(name: string): IconData | null {
  return fromSet(vscodeIconsSet as RawIconSet, name)
}
