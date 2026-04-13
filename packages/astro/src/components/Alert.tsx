import type { AriaRole } from 'preact'
import type { ReactNode } from 'react'

import { isValidElement } from 'react'

import AlertHeading from './AlertHeading.js'

const typeMap: Record<string, string> = {
  info: 'usa-alert--info',
  warning: 'usa-alert--warning',
  error: 'usa-alert--error',
  success: 'usa-alert--success',
  danger: 'usa-alert--error',
  note: 'usa-alert--info',
  tip: 'usa-alert--success',
  important: 'usa-alert--warning',
  caution: 'usa-alert--error',
}

interface AlertProps {
  type?: string
  /**
   * ARIA role applied to the outer alert container. Omit for a static
   * informational alert (no role attribute). Pass `"alert"` for an
   * assertive live region (urgent, interrupts a screen reader) or
   * `"status"` for a polite one (announced on next pause). Defaults to
   * no role since most prose alerts are static and shouldn't trigger
   * assistive-tech announcements.
   */
  role?: AriaRole
  children?: ReactNode
}

/**
 * USWDS alert. Title/heading semantics come from a nested
 * `:::alert-heading` directive rather than a `title` prop, so
 * authors can embed real markdown headings (with their own
 * semantic level, id, and inline formatting) and the TOC walker
 * picks them up via its normal recursive pass — no synthetic
 * heading attrs needed.
 *
 * Usage:
 *
 *     ::alert{type="warning"}
 *       :::alert-heading
 *       ### Heads up
 *       :::
 *
 *       Body copy.
 *     ::
 */
export default function Alert({ type = 'info', role, children }: AlertProps) {
  const alertClass = typeMap[type] ?? 'usa-alert--info'
  // Children may include text nodes (comark's `autoUnwrap` collapses a
  // single-paragraph alert body down to its inline content), so we
  // iterate the raw array instead of filtering to React elements —
  // that would drop every bare-text alert. Only the heading-slot
  // lookup needs to match a React element by component identity.
  const array = Array.isArray(children) ? children : [children]
  const heading = array.find(
    c => isValidElement(c) && c.type === AlertHeading,
  )
  const body = array.filter(c => c !== heading)

  return (
    <div className={`usa-alert ${alertClass}`} role={role}>
      <div className="usa-alert__body">
        {heading}
        <div className="usa-alert__text">{body}</div>
      </div>
    </div>
  )
}
