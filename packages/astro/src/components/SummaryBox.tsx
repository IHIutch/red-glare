import type { ReactNode } from 'react'

import { isValidElement } from 'react'

import SummaryBoxHeading from './SummaryBoxHeading.js'

interface SummaryBoxProps {
  children?: ReactNode
}

/**
 * USWDS summary box. Like `<Alert>`, uses a directive-slot heading
 * (`:::summary-box-heading`) so authors write the title as a real
 * markdown heading and the semantic level comes from the `#` count.
 * The container's `role="region"` makes it a landmark — screen
 * readers announce the inner heading as the region's label
 * automatically, without needing an `aria-labelledby` pairing.
 */
export default function SummaryBox({ children }: SummaryBoxProps) {
  // Iterate the raw children so plain-text bodies (comark's
  // `autoUnwrap` of single-paragraph content) aren't dropped. Only
  // the heading-slot lookup needs `isValidElement` + identity check.
  const array = Array.isArray(children) ? children : [children]
  const heading = array.find(
    c => isValidElement(c) && c.type === SummaryBoxHeading,
  )
  const body = array.filter(c => c !== heading)

  return (
    <div className="usa-summary-box" role="region">
      <div className="usa-summary-box__body">
        {heading}
        <div className="usa-summary-box__text">{body}</div>
      </div>
    </div>
  )
}
