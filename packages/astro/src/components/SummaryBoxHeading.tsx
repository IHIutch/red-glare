import type { ReactNode } from 'react'

interface SummaryBoxHeadingProps {
  children?: ReactNode
}

/**
 * Directive-slot wrapper for a summary box's title. Authors write a
 * real markdown heading inside (`### Key information`) and the
 * semantic level comes from the `#` count. The surrounding div
 * supplies USWDS's `.usa-summary-box__heading` visual treatment
 * without claiming a landmark role — the inner heading element is
 * what anchors the document outline and is picked up by the TOC
 * walker.
 *
 * Usage:
 *
 *     ::summary-box
 *       :::summary-box-heading
 *       ### Key information
 *       :::
 *
 *       Bulleted list or body copy.
 *     ::
 */
export default function SummaryBoxHeading({ children }: SummaryBoxHeadingProps) {
  return (
    <div className="usa-summary-box__heading">
      {children}
    </div>
  )
}
