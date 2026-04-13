import type { ReactNode } from 'react'

import { isValidElement, useId } from 'react'

import { AccordionItemContext } from './accordion-context.js'
import AccordionHeading from './AccordionHeading.js'

interface AccordionProps {
  bordered?: boolean
  multiselectable?: boolean
  children?: ReactNode
}

/**
 * USWDS accordion container. Level and title semantics come from
 * markdown authored inside each `<AccordionItem>` via the
 * `:::accordion-heading` directive, not from component props — so
 * there's no `level` prop, no context-propagation of a heading
 * level, and no coercion of stringly-typed directive attrs.
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
}

/**
 * A single accordion row. Expects two kinds of children:
 *   1. An `<AccordionHeading>` slot (from `:::accordion-heading`).
 *      Its rendered button is placed outside the content panel.
 *   2. Any other prose — rendered inside the hidden/visible content
 *      panel, toggled by USWDS's accordion JS.
 */
export function AccordionItem({
  expanded = false,
  children,
}: AccordionItemProps) {
  const panelId = useId()
  // Iterate the raw children so plain-text bodies (from comark's
  // `autoUnwrap` of single-paragraph content) aren't dropped. Only
  // the heading-slot lookup needs `isValidElement` + identity check.
  const array = Array.isArray(children) ? children : [children]
  const heading = array.find(
    c => isValidElement(c) && c.type === AccordionHeading,
  )
  const body = array.filter(c => c !== heading)

  return (
    // eslint-disable-next-line react/no-context-provider
    <AccordionItemContext.Provider value={{ panelId, expanded }}>
      {heading}
      <div
        id={panelId}
        className="usa-accordion__content usa-prose"
        hidden={!expanded}
      >
        {body}
      </div>
    </AccordionItemContext.Provider>
  )
}
