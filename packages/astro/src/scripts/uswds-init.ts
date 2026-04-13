// Client-side init for USWDS components whose interactivity isn't
// covered by our hydrated React islands (tabs, code groups).

import accordion from '@uswds/uswds/js/usa-accordion'
import banner from '@uswds/uswds/js/usa-banner'
import navigation from '@uswds/uswds/js/usa-header'

export function initUswds(root: HTMLElement = document.body): void {
  // .on() is additive — off() first so repeat init() calls don't
  // double-bind (top-level + astro:page-load both fire on load).
  banner.off(root)
  accordion.off(root)
  navigation.off(root)

  banner.on(root)
  // Accordion must run before navigation: the nav dropdown button
  // matches both modules' selectors, and navigation's force-to-true
  // only cleans up after accordion's flip if it runs second.
  accordion.on(root)
  navigation.on(root)
}

initUswds()
document.addEventListener('astro:page-load', () => initUswds())
