import type { TargetedKeyboardEvent } from 'preact'
import type { ReactElement, ReactNode } from 'react'

import { cva } from 'class-variance-authority'
import { isValidElement, useId, useRef, useState } from 'react'

import type { IconData } from './icon-data.js'

import Icon from './Icon.js'

interface TabsProps {
  'children'?: ReactNode
  'aria-label'?: string
}

interface TabsItemChildProps {
  label?: string
  icon?: string
  iconData?: IconData
  description?: string
}

// Styles are composed with class-variance-authority so the variant map
// is the single source of truth for active/inactive state — both SSR
// and client-side re-renders go through the same function.
const tablistStyles = cva(
  'ss-tabs__list display-flex flex-row border-bottom-1px border-base-lighter',
)

const tabStyles = cva(
  'ss-tabs__tab display-inline-flex flex-align-center bg-transparent text-semibold border-0 padding-y-105 padding-x-2 margin-0 font-sans-sm text-no-underline',
  {
    variants: {
      state: {
        active: 'ss-tabs__tab--active text-black',
        inactive: 'text-base-dark',
      },
    },
    defaultVariants: { state: 'inactive' },
  },
)

const panelStyles = cva('ss-tabs__panel')

// See `collectItems` in CodeGroup for why we iterate children directly
// instead of using Children.toArray.
function collectItems(children: ReactNode): ReactElement<TabsItemChildProps>[] {
  const array = Array.isArray(children) ? children : [children]
  return array.filter(isValidElement) as ReactElement<TabsItemChildProps>[]
}

/**
 * Generic tabbed panel — Nuxt UI's `::tabs` / `::tabs-item` directive
 * equivalent. Each child must be a `<TabsItem>` carrying `label` and an
 * optional Iconify-style `icon` reference (e.g. `i-lucide-eye`).
 *
 * Implements the WAI-ARIA Authoring Practices tabs pattern. Rendered as
 * a hydrated client island via the `Article` wrapper in the slug route,
 * so click + keyboard handlers run in the browser.
 */
export default function Tabs({ children, 'aria-label': ariaLabel }: TabsProps) {
  const groupId = useId()
  const items = collectItems(children)

  const [activeIdx, setActiveIdx] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(e: TargetedKeyboardEvent<HTMLButtonElement>, i: number): void {
    let target = -1
    if (e.key === 'ArrowRight')
      target = (i + 1) % items.length
    else if (e.key === 'ArrowLeft')
      target = (i - 1 + items.length) % items.length
    else if (e.key === 'Home')
      target = 0
    else if (e.key === 'End')
      target = items.length - 1

    if (target < 0)
      return

    e.preventDefault()
    setActiveIdx(target)
    tabRefs.current[target]?.focus()
  }

  return (
    <div className="ss-tabs" data-tabs>
      <div role="tablist" aria-label={ariaLabel ?? 'Tabs'} className={tablistStyles()}>
        {items.map((item, i) => {
          const active = i === activeIdx
          const label = item.props.label ?? `${i + 1}`
          const icon = item.props.iconData
          const tabId = `${groupId}-tab-${i}`
          const panelId = `${groupId}-panel-${i}`
          return (
            <button
              key={tabId}
              ref={(el) => { tabRefs.current[i] = el }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveIdx(i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className={tabStyles({ state: active ? 'active' : 'inactive' })}
            >
              {icon && <Icon icon={icon} className="ss-tabs__tab-icon margin-right-1" />}
              {label}
            </button>
          )
        })}
      </div>
      {items.map((item, i) => {
        const active = i === activeIdx
        const tabId = `${groupId}-tab-${i}`
        const panelId = `${groupId}-panel-${i}`
        return (
          <div
            key={panelId}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!active}
            tabIndex={active ? 0 : -1}
            className={panelStyles()}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}
