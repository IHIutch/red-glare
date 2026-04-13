// Client-side initialization for USWDS components that need manual
// on()/off() lifecycle calls. Our own interactive components (tabs, code
// groups) are hydrated as React client islands via `Article` and don't
// need to be wired up here.

import accordion from '@uswds/uswds/js/usa-accordion'
import banner from '@uswds/uswds/js/usa-banner'
import navigation from '@uswds/uswds/js/usa-header'

function init(): void {
  banner.on(document.body)
  navigation.on(document.body)
  accordion.on(document.body)
}

// Initialize on first load
init()

// Re-initialize on Astro page transitions (View Transitions API)
document.addEventListener('astro:page-load', init)
