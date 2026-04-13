import type { ReactNode } from 'react'

interface ProcessListHeadingProps {
  children?: ReactNode
}

/**
 * Directive-slot wrapper for a process-list item's title. Like the
 * other heading slots in this package, authors write a real markdown
 * heading inside (`### Submit your request`) and the semantic level
 * comes from the `#` count. The surrounding div provides USWDS's
 * `.usa-process-list__heading` visual treatment without claiming a
 * landmark role — the inner heading element is what anchors the
 * document outline and is picked up by the TOC walker.
 */
export default function ProcessListHeading({ children }: ProcessListHeadingProps) {
  return (
    <div className="usa-process-list__heading">
      {children}
    </div>
  )
}
