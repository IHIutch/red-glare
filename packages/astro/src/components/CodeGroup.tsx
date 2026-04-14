import type { TargetedKeyboardEvent } from 'preact'
import type { ReactElement, ReactNode } from 'react'

import { cva } from 'class-variance-authority'
import { isValidElement, useId, useRef, useState } from 'react'

import type { IconData } from './icon-data'

import Icon from './Icon'

interface CodeGroupProps {
  children?: ReactNode
}

interface CodeChildProps {
  filename?: string
  label?: string
  iconData?: IconData
}

// `@comark/react`'s ComarkRenderer passes the mapped `pre` siblings as
// a plain array for `code-group` children, so we iterate directly and
// filter out stray text nodes. Using Children.toArray would work but
// trips the `react/no-children-to-array` lint — and we don't need the
// key normalization it does, since every child already has a stable
// position in the parsed tree.
function collectItems(children: ReactNode): ReactElement<CodeChildProps>[] {
  const array = Array.isArray(children) ? children : [children]
  return array.filter(isValidElement) as ReactElement<CodeChildProps>[]
}

const tablistStyles = cva(
  'rg-code-group__tabs display-flex flex-row',
)

const tabStyles = cva(
  'rg-code-group__tab display-inline-flex flex-align-center bg-transparent text-semibold border-0 padding-y-105 padding-x-2 margin-0 font-sans-sm text-no-underline',
  {
    variants: {
      state: {
        active: 'rg-code-group__tab--active text-black',
        inactive: 'text-base-dark',
      },
    },
    defaultVariants: { state: 'inactive' },
  },
)

const panelStyles = cva('rg-code-group__panel')

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
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

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
    tabsRef.current[target]?.focus()
  }

  return (
    <div className="rg-code-group" data-code-group>
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
              ref={(el) => { tabsRef.current[i] = el }}
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
              {icon && <Icon icon={icon} className="rg-code-group__tab-icon margin-right-1" />}
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
