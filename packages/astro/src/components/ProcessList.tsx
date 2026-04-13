import type { ReactNode } from 'react'

interface ProcessListProps {
  children?: ReactNode
}

/**
 * USWDS process list — an ordered list of numbered steps, rendered
 * with the circle-and-line visual treatment. Authors populate it
 * with one or more `:::process-list-item` children.
 *
 * Usage:
 *
 *     ::process-list
 *       :::process-list-item
 *         ::::process-list-heading
 *         ### Submit your request
 *         ::::
 *
 *         Fill out the form at [foia.gov](https://www.foia.gov/).
 *       :::
 *     ::
 */
export default function ProcessList({ children }: ProcessListProps) {
  return (
    <ol className="usa-process-list">
      {children}
    </ol>
  )
}
