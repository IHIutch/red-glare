import type { ReactNode } from 'react'

interface ProcessListItemProps {
  children?: ReactNode
  /**
   * Heading content from the `#heading` named slot inside the
   * directive. `@comark/react` converts MDC slots into props prefixed
   * with `slot` + PascalCase, so `#heading` arrives here.
   */
  slotHeading?: ReactNode
}

/**
 * A single step inside a `<ProcessList>`. USWDS's CSS handles the
 * numbered circle and connector line via `:nth-child` rules on
 * `.usa-process-list__item`, so the component itself is just a styled
 * `<li>` — no counter state, no per-item props. Title comes from a
 * `#heading` slot rendered directly above the step body, which is how
 * USWDS expects the DOM to look.
 */
export default function ProcessListItem({ children, slotHeading }: ProcessListItemProps) {
  return (
    <li className="usa-process-list__item">
      {slotHeading && (
        <div className="usa-process-list__heading">{slotHeading}</div>
      )}
      <div className="margin-top-05">{children}</div>
    </li>
  )
}
