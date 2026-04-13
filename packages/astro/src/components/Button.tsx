import type { ReactNode } from 'react'

type ButtonVariant
  = | 'secondary'
    | 'accent-cool'
    | 'accent-warm'
    | 'base'
    | 'outline'
    | 'inverse'

interface ButtonProps {
  /**
   * When set, the button renders as an anchor (`<a>`). Omit to
   * render a plain `<button>` (rare in docs — most call-to-action
   * "buttons" in prose are really links).
   */
  href?: string
  /**
   * USWDS button variant modifier. Omit for the default primary
   * button. Mapped to `usa-button--{variant}`.
   */
  variant?: ButtonVariant
  /** Render as the `big` USWDS button variant. */
  big?: boolean
  /** Add `usa-button--unstyled` — strips the button chrome entirely. */
  unstyled?: boolean
  children?: ReactNode
}

/**
 * USWDS button. Renders as an anchor when `href` is set (the
 * common case for docs call-to-action links), otherwise as a
 * real `<button>`. Authors reach for it via the `::button`
 * directive:
 *
 *     :::button{href="/filing" variant="outline"}
 *     Start a request
 *     :::
 *
 * Multi-word variant values come through the directive as-is,
 * so `variant="accent-cool"` → `usa-button--accent-cool`.
 */
export default function Button({
  href,
  variant,
  big,
  unstyled,
  children,
}: ButtonProps) {
  const classes = ['usa-button']
  if (variant)
    classes.push(`usa-button--${variant}`)
  if (big)
    classes.push('usa-button--big')
  if (unstyled)
    classes.push('usa-button--unstyled')
  const className = classes.join(' ')

  if (href) {
    return <a className={className} href={href}>{children}</a>
  }
  return <button type="button" className={className}>{children}</button>
}
