---
title: Accessibility
description: How Red Glare meets WCAG and what you still need to get right.
sidebar:
  order: 6
---

Red Glare inherits the [USWDS accessibility baseline](https://designsystem.digital.gov/documentation/accessibility/) — built on WCAG 2.1 AA. The integration ships with correct markup, focus management, keyboard navigation, and ARIA labels for every component it provides. Authoring still matters — accessibility is partly what you write.

## What the integration does for you

::accordion{bordered}
  :::accordion-item{expanded}
    #heading
    ### Skip-to-content link

    #body
    Every page renders a hidden "Skip to main content" link that appears on keyboard focus. Links the user directly to `<main id="main-content">`, past the government banner, header, and nav.
  :::
  :::accordion-item
    #heading
    ### Semantic landmarks

    #body
    `<header>`, `<nav>`, `<main>`, `<aside>` (for the sidebar and TOC), `<footer>`, and `<section>` (for the identifier) are all present. Assistive tech can jump between regions.
  :::
  :::accordion-item
    #heading
    ### Heading hierarchy

    #body
    Each page has one `<h1>` (from frontmatter `title`). Authored `##` / `###` / `####` preserve their levels — the TOC, deep linking, and slug generation all respect the outline as you author it.
  :::
  :::accordion-item
    #heading
    ### Focus management

    #body
    Tabs and code groups implement the WAI-ARIA Authoring Practices tabs pattern — arrow keys navigate, Home/End jump, only the active tab is in the tab order. Accordions wire `aria-expanded` / `aria-controls` correctly. Every button has a type.
  :::
  :::accordion-item
    #heading
    ### Color contrast

    #body
    Default USWDS tokens meet WCAG AA on body text and interactive elements. If you override tokens via `uswdsSettings`, re-verify contrast for your chosen palette.
  :::
  :::accordion-item
    #heading
    ### Keyboard navigation

    #body
    Everything the mouse can do, the keyboard can do. Navigation, search, tabs, accordions, and the mobile menu all work without a pointing device.
  :::
::

## What you still need to do

::summary-box
  #heading
  ### Author-side checklist

  #body
  - Write meaningful `alt` text for every image.
  - Describe link destinations in the link text, not "click here".
  - Use real headings, not bold paragraphs, for section titles.
  - Keep heading levels sequential — don't skip from `##` to `####`.
  - For alerts and summary boxes, always include the `#heading` slot with a real markdown heading.
  - For language switching, set `i18n.lang` in frontmatter.
::

## Testing

### Automated

Run an accessibility checker against a built site. The two battle-tested options:

- [`axe-core`](https://github.com/dequelabs/axe-core) via Playwright, Puppeteer, or the Chrome extension.
- [WAVE](https://wave.webaim.org/) browser extension.

Both catch common issues — missing alt text, skipped heading levels, insufficient contrast, unlabeled form fields — and neither replaces manual review.

### Manual

- **Keyboard-only walkthrough.** Tab through every page. Every interactive element should be reachable, visible when focused, and activatable with Enter/Space.
- **Screen reader pass.** VoiceOver (Mac) or NVDA (Windows). Listen to a page top to bottom. Regions should be announced with their names; images should have meaningful descriptions; code blocks should be readable.
- **Zoom to 200%.** Content should reflow without horizontal scrolling.

## Limitations

- **Color contrast is only enforced for USWDS defaults.** Custom theming via `uswdsSettings` can introduce contrast failures; re-test after theming changes.
- **Math accessibility relies on KaTeX.** Complex equations render with KaTeX's built-in accessibility; screen readers announce equations linearly. For high-stakes content (exams, legal text), consider providing a text-only fallback.
- **Third-party embeds are your responsibility.** If you embed a YouTube video, a CodePen, or similar, meet the accessibility bar yourself — the integration doesn't inspect embed content.

## Reporting an a11y bug

Found something that regresses the baseline? File an issue on the [repo](https://github.com/IHIutch/red-glare/issues) tagged `accessibility`. Include the page URL, the assistive tech you're using, and the expected behavior.
