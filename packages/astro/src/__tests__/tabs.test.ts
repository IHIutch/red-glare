import axe from 'axe-core'
import { act } from 'react'
import { afterEach, describe, expect, it } from 'vitest'

import { renderComark, unmountComark } from './test-utils/comark'

const F = '```'
const FIXTURE = `
::tabs
  :::tabs-item{label="Preview" icon="i-lucide-eye"}
  Hello from the preview panel.
  :::

  :::tabs-item{label="Code" icon="i-lucide-code"}
  ${F}ts
  const x = 1
  ${F}
  :::

  :::tabs-item{label="Notes"}
  Some plain text without an icon.
  :::
::
`

function getGroup(): HTMLElement {
  return document.querySelector<HTMLElement>('.ss-tabs[data-tabs]')!
}

function getTabs(): HTMLButtonElement[] {
  const group = getGroup()
  return Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    .filter(t => t.closest('[data-tabs]') === group)
}

function getPanels(): HTMLElement[] {
  const group = getGroup()
  return Array.from(group.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
    .filter(p => p.closest('[data-tabs]') === group)
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

describe('Tabs — static ARIA & labels', () => {
  afterEach(() => {
    unmountComark()
  })

  it('renders a tablist with one tab per tabs-item child', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()
    const panels = getPanels()
    expect(tabs).toHaveLength(3)
    expect(panels).toHaveLength(3)
  })

  it('uses each item label as the tab text', async () => {
    await renderComark(FIXTURE)
    const labels = getTabs().map(t => t.textContent?.trim())
    expect(labels).toEqual(['Preview', 'Code', 'Notes'])
  })

  it('renders inline SVG icons for items that specify `icon`, none otherwise', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()
    expect(tabs[0].querySelector('svg.ss-tabs__tab-icon')).not.toBeNull()
    expect(tabs[1].querySelector('svg.ss-tabs__tab-icon')).not.toBeNull()
    expect(tabs[2].querySelector('svg.ss-tabs__tab-icon')).toBeNull()
  })

  it('pairs tabs and panels via aria-controls / aria-labelledby', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()
    const panels = getPanels()
    tabs.forEach((tab, i) => {
      expect(tab.getAttribute('aria-controls')).toBe(panels[i].id)
      expect(panels[i].getAttribute('aria-labelledby')).toBe(tab.id)
    })
  })

  it('passes axe-core with no violations', async () => {
    await renderComark(FIXTURE)
    const results = await axe.run(getGroup(), {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
    expect(results.violations).toEqual([])
  })
})

describe('Tabs — keyboard interaction', () => {
  afterEach(() => {
    unmountComark()
  })

  it('Arrow keys cycle focus + selection', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()

    tabs[0].focus()
    await press(tabs[0], 'ArrowRight')
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[1])

    await press(tabs[1], 'ArrowLeft')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
  })

  it('Home / End jump to first / last tab', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()

    tabs[0].focus()
    await press(tabs[0], 'End')
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')

    await press(tabs[2], 'Home')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
  })

  it('clicking a tab activates its panel and hides the others', async () => {
    await renderComark(FIXTURE)
    const tabs = getTabs()
    const panels = getPanels()

    await click(tabs[1])
    expect(panels[0].hasAttribute('hidden')).toBe(true)
    expect(panels[1].hasAttribute('hidden')).toBe(false)
    expect(panels[1].tabIndex).toBe(0)
  })
})
