import type { IconData } from './icon-data'

interface IconProps {
  icon: IconData
  className?: string
}

/**
 * Inline SVG icon rendered from resolved Iconify data. Used by tab
 * components that need a statically-rendered icon next to a label —
 * no client hydration, no web fonts, no external requests.
 */
export default function Icon({ icon, className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      width="1em"
      height="1em"
      aria-hidden="true"
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  )
}
