// Locale-based content routing utilities
// Supports locale folders: src/content/docs/en/, src/content/docs/es/

import type { RedGlareConfig } from '../config'

/**
 * Extract locale prefix from a content entry ID.
 * e.g., "en/getting-started" → "en", "getting-started" → undefined
 */
export function getLocaleFromId(
  id: string,
  locales: string[],
): string | undefined {
  const firstSegment = id.split('/')[0]
  return locales.includes(firstSegment) ? firstSegment : undefined
}

/**
 * Strip locale prefix from an entry ID to get the base slug.
 * e.g., "en/getting-started" → "getting-started"
 */
export function stripLocalePrefix(id: string, locale: string): string {
  return id.startsWith(`${locale}/`) ? id.slice(locale.length + 1) : id
}

/**
 * Build the URL path for a localized page.
 * Default locale pages live at root, others get a locale prefix.
 */
export function getLocalizedPath(
  id: string,
  locale: string | undefined,
  defaultLocale: string,
): string {
  if (!locale || locale === defaultLocale) {
    // Default locale: no prefix
    const slug = locale ? stripLocalePrefix(id, locale) : id
    return slug === 'index' ? '/' : `/${slug}/`
  }
  // Non-default locale: add prefix
  const slug = stripLocalePrefix(id, locale)
  return slug === 'index' ? `/${locale}/` : `/${locale}/${slug}/`
}

/**
 * Find equivalent pages across locales for the language switcher.
 */
export function findTranslations(
  currentId: string,
  allIds: string[],
  config: Pick<RedGlareConfig, 'locales' | 'defaultLocale'>,
): Array<{ locale: string, label: string, href: string }> {
  const locales = Object.keys(config.locales ?? {})
  if (locales.length <= 1)
    return []

  const currentLocale = getLocaleFromId(currentId, locales)
  const baseSlug = currentLocale
    ? stripLocalePrefix(currentId, currentLocale)
    : currentId

  return locales
    .map((locale) => {
      const targetId
        = locale === config.defaultLocale ? baseSlug : `${locale}/${baseSlug}`
      const exists = allIds.includes(targetId)
      if (!exists)
        return null

      return {
        locale,
        label: config.locales?.[locale]?.label ?? locale,
        href: getLocalizedPath(targetId, locale, config.defaultLocale),
      }
    })
    .filter((t): t is NonNullable<typeof t> => t !== null)
}
