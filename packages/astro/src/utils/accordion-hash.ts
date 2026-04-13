/**
 * Expand a USWDS accordion panel if the current URL hash resolves to
 * an element that belongs to one. Enables deep-linking into accordion
 * content two different ways:
 *
 *   1. The hash matches the accordion item's own heading slug (the id
 *      `attachTocHeadings` assigns to the `.usa-accordion__heading`
 *      element when the parent accordion has `level` set). The
 *      heading sits before the panel in the DOM, so we walk forward
 *      to find the sibling `.usa-accordion__content` panel.
 *
 *   2. The hash matches a heading deeper inside a panel body — e.g.
 *      `### Fee schedule` inside an FAQ answer. Walk up the DOM to
 *      the nearest `.usa-accordion__content` container.
 *
 * Either way, if the panel is currently hidden, click its button to
 * let USWDS's own toggle handler run (which updates `aria-expanded`
 * and the `hidden` attr). Then scroll the original target into view.
 */
export function expandAccordionForHash(): void {
  const hash = location.hash?.slice(1)
  if (!hash)
    return

  const target = document.getElementById(hash)
  if (!target)
    return

  // Case 1: target IS (or sits inside) an accordion heading element.
  // Walk forward to the sibling content panel.
  const heading = target.closest('.usa-accordion__heading')
  const panel = heading instanceof HTMLElement
    ? heading.nextElementSibling
    // Case 2: target is inside a panel body. Walk up to the content.
    : target.closest('.usa-accordion__content')

  if (!(panel instanceof HTMLElement))
    return
  if (!panel.classList.contains('usa-accordion__content'))
    return

  if (panel.hasAttribute('hidden')) {
    const button = heading?.querySelector('.usa-accordion__button')
      ?? panel.previousElementSibling?.querySelector('.usa-accordion__button')
      ?? panel.parentElement?.querySelector(`[aria-controls="${panel.id}"]`)
    if (button instanceof HTMLElement)
      button.click()
  }

  requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }))
}
