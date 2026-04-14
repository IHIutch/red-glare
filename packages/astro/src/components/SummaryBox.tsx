import type { ReactNode } from 'react'

interface SummaryBoxProps {
  children?: ReactNode
  /**
   * Heading content from the `#heading` named slot inside the
   * directive. `@comark/react` converts MDC slots into props prefixed
   * with `slot` + PascalCase, so `#heading` arrives here.
   */
  slotHeading?: ReactNode
}

/**
 * USWDS summary box. Like `<Alert>`, uses a `#heading` named slot
 * inside the directive so authors write the title as a real markdown
 * heading and the semantic level comes from the `#` count. The
 * container's `role="region"` makes it a landmark — screen readers
 * announce the inner heading as the region's label automatically,
 * without needing an `aria-labelledby` pairing.
 */
export default function SummaryBox({ children, slotHeading }: SummaryBoxProps) {
  return (
    <div className="usa-summary-box" role="region">
      <div className="usa-summary-box__body">
        {slotHeading && (
          <div className="usa-summary-box__heading">{slotHeading}</div>
        )}
        <div className="usa-summary-box__text">{children}</div>
      </div>
    </div>
  )
}
