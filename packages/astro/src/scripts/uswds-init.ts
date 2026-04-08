// Client-side USWDS JavaScript initialization.
// Interactive USWDS components require manual on()/off() lifecycle calls.

import banner from "@uswds/uswds/js/usa-banner";
import navigation from "@uswds/uswds/js/usa-header";

function init() {
  banner.on(document.body);
  navigation.on(document.body);
}

// Initialize on first load
init();

// Re-initialize on Astro page transitions (View Transitions API)
document.addEventListener("astro:page-load", init);
