import type { ReactNode } from 'react'

import { useContext } from 'react'

import { AccordionItemContext } from './accordion-context.js'

interface AccordionHeadingProps {
  children?: ReactNode
}

/**
 * Directive-slot wrapper for an accordion item's clickable title.
 * Authors write a markdown heading inside (`### What is FOIA?`) and
 * the semantic level comes from the `#` count rather than a `level`
 * prop on the parent accordion.
 *
 * USWDS's accordion pattern puts the `<button>` inside an `h1`–`h6`
 * wrapper. We invert that: the outer element is a presentational
 * `<div class="usa-accordion__heading">`, the button sits inside,
 * and the author's real heading lives inside the button. The inner
 * heading carries the id (via `attachTocHeadings`' slug backfill on
 * `h1`–`h6` elements), so deep linking and the TOC walker both work
 * without any component-side plumbing. A scoped SCSS rule resets
 * heading margins / font-weight inside the button so the layout
 * matches USWDS visually.
 *
 * The `aria-controls` / panel id wiring reads from
 * `AccordionItemContext`, which each `<AccordionItem>` provides
 * with its own `useId()`-generated panel id.
 *
 * Usage:
 *
 *     ::accordion
 *       :::accordion-item
 *         ::::accordion-heading
 *         ### What is FOIA?
 *         ::::
 *
 *         Body content.
 *       :::
 *     ::
 */
export default function AccordionHeading({ children }: AccordionHeadingProps) {
  // eslint-disable-next-line react/no-use-context
  const ctx = useContext(AccordionItemContext)
  return (
    <div className="usa-accordion__heading">
      <button
        type="button"
        className="usa-accordion__button"
        aria-expanded={ctx?.expanded ?? false}
        aria-controls={ctx?.panelId}
      >
        {children}
      </button>
    </div>
  )
}
