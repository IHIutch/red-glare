import type { KeyboardEvent, ReactElement, ReactNode } from 'react'

import { cva } from 'class-variance-authority'
import { Children, isValidElement, useId, useRef, useState } from 'react'

import type { IconData } from './icon-data.js'

import Icon from './Icon.js'

interface CodeGroupProps {
  children?: ReactNode
}

interface CodeChildProps {
  filename?: string
  label?: string
  iconData?: IconData
}

function collectItems(children: ReactNode): ReactElement<CodeChildProps>[] {
  return Children.toArray(children).filter(isValidElement) as ReactElement<CodeChildProps>[]
}

const tablistStyles = cva(
  'ss-code-group__tabs display-flex flex-row',
)

const tabStyles = cva(
  'ss-code-group__tab display-inline-flex flex-align-center bg-transparent text-semibold border-0 padding-y-105 padding-x-2 margin-0 font-sans-sm text-no-underline',
  {
    variants: {
      state: {
        active: 'ss-code-group__tab--active text-black',
        inactive: 'text-base-dark',
      },
    },
    defaultVariants: { state: 'inactive' },
  },
)

const panelStyles = cva('ss-code-group__panel')

/**
 * Tabbed code group — each child code block's tab label comes from its
 * `filename` attribute (set via the `[filename]` bracket syntax after the
 * fenced language), with `label` and the child's index as fallbacks.
 * Icons are inferred from the filename via `getLangIcon`.
 *
 * Rendered as a hydrated client island via the `Article` wrapper, so
 * click + keyboard handlers run in the browser.
 */
export default function CodeGroup({ children }: CodeGroupProps) {
  const groupId = useId()
  const items = collectItems(children)

  const [activeIdx, setActiveIdx] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number): void {
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
    <div className="ss-code-group" data-code-group>
      <div role="tablist" aria-label="Code alternatives" className={tablistStyles()}>
        {items.map((child, i) => {
          const active = i === activeIdx
          const label = child.props.filename ?? child.props.label ?? `${i + 1}`
          const icon = child.props.iconData
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
              {icon && <Icon icon={icon} className="ss-code-group__tab-icon margin-right-1" />}
              {label}
            </button>
          )
        })}
      </div>
      {items.map((child, i) => {
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
            {child}
          </div>
        )
      })}
    </div>
  )
}
