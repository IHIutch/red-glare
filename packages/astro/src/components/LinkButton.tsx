import type { ReactNode } from 'react'

type LinkButtonVariant
  = | 'secondary'
    | 'accent-cool'
    | 'accent-warm'
    | 'base'
    | 'outline'
    | 'inverse'

interface LinkButtonProps {
  /**
   * Destination URL. Required — `LinkButton` only renders anchors.
   * For a real `<button>` element, reach for a form or use raw USWDS
   * classes directly; prose components rarely need a non-link button.
   */
  href: string
  /**
   * USWDS button variant modifier. Omit for the default primary
   * button. Mapped to `usa-button--{variant}`.
   */
  variant?: LinkButtonVariant
  /** Render as the `big` USWDS button variant. */
  big?: boolean
  /** Add `usa-button--unstyled` — strips the button chrome entirely. */
  unstyled?: boolean
  children?: ReactNode
}

/**
 * USWDS-styled anchor. Authors reach for it via the `::link-button`
 * directive when they want a call-to-action link that looks like a
 * button:
 *
 *     :::link-button{href="/filing" variant="outline"}
 *     Start a request
 *     :::
 *
 * Multi-word variant values come through the directive as-is, so
 * `variant="accent-cool"` → `usa-button--accent-cool`.
 */
export default function LinkButton({
  href,
  variant,
  big,
  unstyled,
  children,
}: LinkButtonProps) {
  const classes = ['usa-button']
  if (variant)
    classes.push(`usa-button--${variant}`)
  if (big)
    classes.push('usa-button--big')
  if (unstyled)
    classes.push('usa-button--unstyled')

  return <a className={classes.join(' ')} href={href}>{children}</a>
}
