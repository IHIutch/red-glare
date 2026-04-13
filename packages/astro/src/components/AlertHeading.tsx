import type { ReactNode } from 'react'

interface AlertHeadingProps {
  children?: ReactNode
}

/**
 * Directive-slot wrapper for an alert's title. Authors write a real
 * markdown heading inside (`### Heads up`) and the semantic level
 * comes from the `#` count rather than a prop. The surrounding div
 * provides USWDS's `.usa-alert__heading` visual treatment without
 * claiming a landmark role — the inner heading element is what
 * anchors the document outline and is picked up by the TOC walker.
 *
 * Usage:
 *
 *     ::alert{type="warning"}
 *       :::alert-heading
 *       ### Scheduled maintenance
 *       :::
 *
 *       Body copy.
 *     ::
 */
export default function AlertHeading({ children }: AlertHeadingProps) {
  return (
    <div className="usa-alert__heading text-bold">
      {children}
    </div>
  )
}
