// Framework UI string translation system
// Ships with English defaults. Users add translations for configured locales.

export interface UIStrings {
  "nav.skipToContent": string;
  "nav.onThisPage": string;
  "nav.editThisPage": string;
  "nav.previous": string;
  "nav.next": string;
  "nav.returnToTop": string;
  "search.placeholder": string;
  "search.label": string;
  "404.title": string;
  "404.message": string;
  "404.backHome": string;
  "banner.official": string;
  "banner.howYouKnow": string;
}

const en: UIStrings = {
  "nav.skipToContent": "Skip to main content",
  "nav.onThisPage": "On this page",
  "nav.editThisPage": "Edit this page",
  "nav.previous": "Previous",
  "nav.next": "Next",
  "nav.returnToTop": "Return to top",
  "search.placeholder": "Search documentation...",
  "search.label": "Search",
  "404.title": "Page Not Found",
  "404.message":
    "The page you're looking for might have been moved or no longer exists.",
  "404.backHome": "Return to homepage",
  "banner.official":
    "An official website of the United States government",
  "banner.howYouKnow": "Here's how you know",
};

const es: UIStrings = {
  "nav.skipToContent": "Ir al contenido principal",
  "nav.onThisPage": "En esta pagina",
  "nav.editThisPage": "Editar esta pagina",
  "nav.previous": "Anterior",
  "nav.next": "Siguiente",
  "nav.returnToTop": "Volver arriba",
  "search.placeholder": "Buscar documentacion...",
  "search.label": "Buscar",
  "404.title": "Pagina no encontrada",
  "404.message":
    "La pagina que buscas puede haber sido movida o ya no existe.",
  "404.backHome": "Volver a la pagina principal",
  "banner.official":
    "Un sitio web oficial del gobierno de los Estados Unidos",
  "banner.howYouKnow": "Asi es como usted puede verificarlo",
};

const builtInTranslations: Record<string, UIStrings> = { en, es };

/**
 * Get translated UI strings for a given locale.
 * Falls back to English for missing translations.
 */
export function getTranslations(locale: string): UIStrings {
  return builtInTranslations[locale] ?? en;
}

/**
 * Get a single translated string.
 */
export function t(locale: string, key: keyof UIStrings): string {
  const strings = getTranslations(locale);
  return strings[key];
}
