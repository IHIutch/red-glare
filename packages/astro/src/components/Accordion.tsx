import type { ReactNode } from 'react'

import { useId } from 'react'

interface AccordionProps {
  bordered?: boolean
  multiselectable?: boolean
  children?: ReactNode
}

/**
 * USWDS accordion container. Level and title semantics come from
 * markdown authored inside each `<AccordionItem>`'s `#heading` slot,
 * not from component props — so there's no `level` prop, no
 * context-propagation of a heading level, and no coercion of
 * stringly-typed directive attrs.
 */
export function Accordion({
  bordered = false,
  multiselectable = false,
  children,
}: AccordionProps) {
  const className = bordered
    ? 'usa-accordion usa-accordion--bordered'
    : 'usa-accordion'

  return (
    <div
      className={className}
      {...(multiselectable ? { 'data-allow-multiple': '' } : {})}
    >
      {children}
    </div>
  )
}

interface AccordionItemProps {
  expanded?: boolean
  children?: ReactNode
  /**
   * Heading content from the `#heading` named slot inside the
   * directive. `@comark/react` converts MDC slots into props prefixed
   * with `slot` + PascalCase, so `#heading` arrives here.
   *
   * USWDS's accordion pattern puts the `<button>` inside an `h1`–`h6`
   * wrapper. We invert that: the outer element is a presentational
   * `<div class="usa-accordion__heading">`, the button sits inside,
   * and the author's real heading lives inside the button. The inner
   * heading carries the id (via `attachTocHeadings`' slug backfill on
   * `h1`–`h6` elements), so deep linking and the TOC walker both work
   * without any component-side plumbing.
   */
  slotHeading?: ReactNode
}

/**
 * A single accordion row. The `#heading` slot becomes the clickable
 * button (USWDS's accordion pattern), and the rest of the directive
 * body becomes the toggleable panel.
 *
 * Usage:
 *
 *     ::accordion
 *       :::accordion-item
 *       #heading
 *       ### What is FOIA?
 *
 *       Body content.
 *       :::
 *     ::
 */
export function AccordionItem({
  expanded = false,
  children,
  slotHeading,
}: AccordionItemProps) {
  const panelId = useId()

  return (
    <>
      <div className="usa-accordion__heading">
        <button
          type="button"
          className="usa-accordion__button"
          aria-expanded={expanded}
          aria-controls={panelId}
        >
          {slotHeading}
        </button>
      </div>
      <div
        id={panelId}
        className="usa-accordion__content usa-prose"
        hidden={!expanded}
      >
        {children}
      </div>
    </>
  )
}
