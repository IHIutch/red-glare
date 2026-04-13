import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { initUswds } from '../scripts/uswds-init'

// Minimal USWDS header-nav fixture that matches the markup `Header.astro`
// produces for a dropdown navigation item. The button carries both
// `usa-accordion__button` and `usa-nav__link` classes — the same shape
// that caused the "first click does nothing, second click opens" bug
// before we fixed the order of `.on()` calls in `uswds-init.ts`.
const NAV_FIXTURE = `
  <header class="usa-header usa-header--basic">
    <div class="usa-nav-container">
      <nav class="usa-nav">
        <ul class="usa-nav__primary usa-accordion">
          <li class="usa-nav__primary-item">
            <button
              type="button"
              class="usa-accordion__button usa-nav__link"
              aria-expanded="false"
              aria-controls="test-nav-section"
            >
              <span>Reference</span>
            </button>
            <ul id="test-nav-section" class="usa-nav__submenu" hidden>
              <li class="usa-nav__submenu-item">
                <a href="#one"><span>One</span></a>
              </li>
              <li class="usa-nav__submenu-item">
                <a href="#two"><span>Two</span></a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </header>
`

function mountNavFixture(): { button: HTMLButtonElement, submenu: HTMLElement } {
  document.body.innerHTML = NAV_FIXTURE
  initUswds()
  const button = document.querySelector<HTMLButtonElement>(
    'button.usa-accordion__button.usa-nav__link',
  )!
  const submenu = document.getElementById('test-nav-section')!
  return { button, submenu }
}

it('uswds-init: opens the nav dropdown on the first click', async () => {
  const { button, submenu } = mountNavFixture()

  expect(button.getAttribute('aria-expanded')).toBe('false')
  expect(submenu.hasAttribute('hidden')).toBe(true)

  await userEvent.click(button)

  // This is the regression guard. The USWDS nav button matches both
  // `accordion` and `navigation` behavior selectors; click handlers from
  // both modules run on every click, and their interaction only works
  // when `accordion.on()` was called BEFORE `navigation.on()`. With the
  // wrong order, accordion's toggle flips the state right after
  // navigation's force-open, and the first click has zero visible
  // effect. `initUswds` is responsible for matching USWDS's own
  // `start.js` ordering (accordion first, navigation second).
  expect(button.getAttribute('aria-expanded')).toBe('true')
  expect(submenu.hasAttribute('hidden')).toBe(false)
})

it('uswds-init: toggles the nav dropdown closed on a second click', async () => {
  const { button, submenu } = mountNavFixture()

  await userEvent.click(button)
  expect(button.getAttribute('aria-expanded')).toBe('true')

  await userEvent.click(button)
  expect(button.getAttribute('aria-expanded')).toBe('false')
  expect(submenu.hasAttribute('hidden')).toBe(true)
})

it('uswds-init: calling initUswds twice does not double-bind click handlers', async () => {
  const { button, submenu } = mountNavFixture()

  // A second init on the same DOM used to double the listeners and
  // produce a broken toggle cadence. `off()` before `on()` inside
  // `initUswds` should keep the click behavior identical regardless of
  // how many times we re-initialize.
  initUswds()

  await userEvent.click(button)
  expect(button.getAttribute('aria-expanded')).toBe('true')
  expect(submenu.hasAttribute('hidden')).toBe(false)

  await userEvent.click(button)
  expect(button.getAttribute('aria-expanded')).toBe('false')
  expect(submenu.hasAttribute('hidden')).toBe(true)
})
