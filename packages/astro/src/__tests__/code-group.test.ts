import axe from 'axe-core'
import { act } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import { renderComark, unmountComark } from './test-utils/comark'

const F = '```'
const FIXTURE = `
::code-group

${F}js [app.js]
console.log('a')
${F}

${F}ts [app.ts]
const x: number = 1
${F}

${F}css [styles.css]
.x { color: red }
${F}

::
`

function getGroup(): HTMLElement {
  return document.querySelector<HTMLElement>('[data-code-group]')!
}

function getTabs(): HTMLButtonElement[] {
  return Array.from(getGroup().querySelectorAll<HTMLButtonElement>('[role="tab"]'))
}

function getPanels(): HTMLElement[] {
  return Array.from(getGroup().querySelectorAll<HTMLElement>('[role="tabpanel"]'))
}

async function press(el: HTMLElement, key: string): Promise<void> {
  await act(async () => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  })
}

async function click(el: HTMLElement): Promise<void> {
  await act(async () => {
    el.click()
  })
}

describe('CodeGroup — static ARIA', () => {
  afterEach(() => {
    unmountComark()
  })

  it('renders a tablist with tabs and tabpanels wired together', async () => {
    await renderComark(FIXTURE)

    const tablist = getGroup().querySelector('[role="tablist"]')!
    expect(tablist.getAttribute('aria-label')).toBeTruthy()

    const tabs = getTabs()
    const panels = getPanels()
    expect(tabs).toHaveLength(3)
    expect(panels).toHaveLength(3)

    tabs.forEach((tab, i) => {
      expect(tab.tagName).toBe('BUTTON')
      expect(tab.getAttribute('type')).toBe('button')
      expect(tab.getAttribute('role')).toBe('tab')
      expect(tab.getAttribute('aria-controls')).toBe(panels[i].id)
      expect(panels[i].getAttribute('aria-labelledby')).toBe(tab.id)
    })
  })

  it('uses filenames from [bracket] syntax as tab labels', async () => {
    await renderComark(FIXTURE)
    const labels = getTabs().map(t => t.textContent?.trim())
    expect(labels).toEqual(['app.js', 'app.ts', 'styles.css'])
  })

  it('starts with only the first tab selected and its panel visible', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()
    const panels = getPanels()

    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].tabIndex).toBe(0)
    expect(panels[0].hasAttribute('hidden')).toBe(false)
    expect(panels[0].tabIndex).toBe(0)

    for (const tab of tabs.slice(1))
      expect(tab.tabIndex).toBe(-1)
    for (const panel of panels.slice(1)) {
      expect(panel.hasAttribute('hidden')).toBe(true)
      expect(panel.tabIndex).toBe(-1)
    }
  })

  it('passes axe-core ruleset with no violations', async () => {
    await renderComark(FIXTURE)
    const results = await axe.run(getGroup(), {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
    expect(results.violations).toEqual([])
  })
})

describe('CodeGroup — keyboard interaction', () => {
  afterEach(() => {
    unmountComark()
  })

  it('clicking a tab activates it and shows its panel', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()
    const panels = getPanels()

    await click(tabs[2])

    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].getAttribute('aria-selected')).toBe('false')
    expect(panels[2].hasAttribute('hidden')).toBe(false)
    expect(panels[0].hasAttribute('hidden')).toBe(true)
  })

  it('ArrowRight cycles forward and wraps; ArrowLeft cycles back and wraps', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()

    tabs[0].focus()
    await press(tabs[0], 'ArrowRight')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[1])

    await press(tabs[1], 'ArrowRight')
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')

    await press(tabs[2], 'ArrowRight')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[0])

    await press(tabs[0], 'ArrowLeft')
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[2])
  })

  it('Home jumps to the first tab and End jumps to the last', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()

    tabs[0].focus()
    await press(tabs[0], 'End')
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[2])

    await press(tabs[2], 'Home')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[0])
  })

  it('keeps tabIndex roving: only the active tab is tab-stoppable', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()

    tabs[0].focus()
    await press(tabs[0], 'ArrowRight')

    expect(tabs[0].tabIndex).toBe(-1)
    expect(tabs[1].tabIndex).toBe(0)
    expect(tabs[2].tabIndex).toBe(-1)
  })
})
