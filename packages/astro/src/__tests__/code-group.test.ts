import axe from 'axe-core'
import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { renderComark } from './test-utils/comark'

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

it('codeGroup: renders a tablist with tabs and tabpanels wired together', async () => {
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

it('codeGroup: uses filenames from [bracket] syntax as tab labels', async () => {
  await renderComark(FIXTURE)
  const labels = getTabs().map(t => t.textContent?.trim())
  expect(labels).toEqual(['app.js', 'app.ts', 'styles.css'])
})

it('codeGroup: starts with only the first tab selected and its panel visible', async () => {
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

it('codeGroup: passes axe-core ruleset with no violations', async () => {
  await renderComark(FIXTURE)
  const results = await axe.run(getGroup(), {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  })
  expect(results.violations).toEqual([])
})

it('codeGroup: clicking a tab activates it and shows its panel', async () => {
  await renderComark(FIXTURE)
  const tabs = getTabs()
  const panels = getPanels()

  await userEvent.click(tabs[2])

  expect(tabs[2].getAttribute('aria-selected')).toBe('true')
  expect(tabs[0].getAttribute('aria-selected')).toBe('false')
  expect(panels[2].hasAttribute('hidden')).toBe(false)
  expect(panels[0].hasAttribute('hidden')).toBe(true)
})

it('codeGroup: ArrowRight cycles forward and wraps; ArrowLeft cycles back and wraps', async () => {
  await renderComark(FIXTURE)
  const tabs = getTabs()

  await userEvent.tab()
  expect(tabs[0]).toHaveFocus()

  await userEvent.keyboard('{ArrowRight}')
  expect(tabs[1].getAttribute('aria-selected')).toBe('true')
  expect(tabs[1]).toHaveFocus()

  await userEvent.keyboard('{ArrowRight}')
  expect(tabs[2].getAttribute('aria-selected')).toBe('true')

  await userEvent.keyboard('{ArrowRight}')
  expect(tabs[0].getAttribute('aria-selected')).toBe('true')
  expect(tabs[0]).toHaveFocus()

  await userEvent.keyboard('{ArrowLeft}')
  expect(tabs[2].getAttribute('aria-selected')).toBe('true')
  expect(tabs[2]).toHaveFocus()
})

it('codeGroup: Home jumps to the first tab and End jumps to the last', async () => {
  await renderComark(FIXTURE)
  const tabs = getTabs()

  await userEvent.tab()
  await userEvent.keyboard('{End}')
  expect(tabs[2].getAttribute('aria-selected')).toBe('true')
  expect(tabs[2]).toHaveFocus()

  await userEvent.keyboard('{Home}')
  expect(tabs[0].getAttribute('aria-selected')).toBe('true')
  expect(tabs[0]).toHaveFocus()
})

it('codeGroup: keeps tabIndex roving — only the active tab is tab-stoppable', async () => {
  await renderComark(FIXTURE)
  const tabs = getTabs()

  await userEvent.tab()
  await userEvent.keyboard('{ArrowRight}')

  expect(tabs[0].tabIndex).toBe(-1)
  expect(tabs[1].tabIndex).toBe(0)
  expect(tabs[2].tabIndex).toBe(-1)
})
