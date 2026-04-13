import type { ReactNode } from 'react'

interface ProcessListItemProps {
  children?: ReactNode
}

/**
 * A single step inside a `<ProcessList>`. USWDS's CSS handles the
 * numbered circle and connector line via `:nth-child` rules on
 * `.usa-process-list__item`, so the component itself is just a
 * styled `<li>` — no counter state, no per-item props.
 *
 * Children are passed through unchanged: the author's
 * `:::process-list-heading` slot ends up inside the item alongside
 * the step body, which is how USWDS expects the DOM to look.
 */
export default function ProcessListItem({ children }: ProcessListItemProps) {
  return (
    <li className="usa-process-list__item">
      {children}
    </li>
  )
}
