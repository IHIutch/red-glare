import type { AriaRole } from 'preact'
import type { ReactNode } from 'react'

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
  /**
   * Heading content from the `#heading` named slot inside the alert
   * directive. `@comark/react` converts MDC slots into props prefixed
   * with `slot` + PascalCase, so `#heading` arrives here.
   */
  slotHeading?: ReactNode
}

/**
 * USWDS alert. Title/heading semantics come from a `#heading` slot
 * inside the directive rather than a `title` prop, so authors can embed
 * real markdown headings (with their own semantic level, id, and inline
 * formatting) and the TOC walker picks them up via its normal recursive
 * pass — no synthetic heading attrs needed.
 *
 * Usage:
 *
 *     ::alert{type="warning"}
 *     #heading
 *     ### Heads up
 *
 *     Body copy.
 *     ::
 */
export default function Alert({ type = 'info', role, children, slotHeading }: AlertProps) {
  const alertClass = typeMap[type] ?? 'usa-alert--info'
  return (
    <div className={`usa-alert ${alertClass}`} role={role}>
      <div className="usa-alert__body">
        {slotHeading && (
          <div className="usa-alert__heading text-bold">{slotHeading}</div>
        )}
        <div className="usa-alert__text">{children}</div>
      </div>
    </div>
  )
}
