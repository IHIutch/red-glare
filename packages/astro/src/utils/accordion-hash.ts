/**
 * Expand a USWDS accordion panel if the current URL hash points to an
 * element inside a collapsed panel. Enables deep-linking into accordion
 * content — e.g. linking directly to a heading inside an FAQ answer.
 */
export function expandAccordionForHash(): void {
  const hash = location.hash?.slice(1)
  if (!hash)
    return

  const target = document.getElementById(hash)
  const panel = target?.closest('.usa-accordion__content[hidden]')
  const button = panel?.previousElementSibling?.querySelector('.usa-accordion__button')
    ?? panel?.parentElement?.querySelector(`[aria-controls="${panel?.id}"]`)

  if (!(button instanceof HTMLElement))
    return

  button.click()
  requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'smooth' }))
}
