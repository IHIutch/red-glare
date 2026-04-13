import type { Root } from 'react-dom/client'

import { ComarkRenderer } from '@comark/react'
import accordion from '@uswds/uswds/js/usa-accordion'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'

import { parseContent } from '../../comark'
import { Accordion, AccordionItem } from '../../components/Accordion'
import Alert from '../../components/Alert'
import CodeGroup from '../../components/CodeGroup'
import Tabs from '../../components/Tabs'
import TabsItem from '../../components/TabsItem'

/**
 * No-op tagged template literal for markdown fixtures. Exists purely to
 * enable VS Code syntax highlighting inside the template literal via the
 * `bierner.comment-tagged-templates` extension (or similar). At runtime
 * it just returns the raw string.
 *
 * Usage:
 *   await renderComark(md`
 *     ::accordion
 *       :::accordion-item{title="Q"}
 *       Body content
 *       :::
 *     ::
 *   `)
 */
export const md = String.raw

const components = {
  Alert,
  'code-group': CodeGroup,
  'tabs': Tabs,
  'tabs-item': TabsItem,
  Accordion,
  AccordionItem,
}

let currentRoot: Root | null = null

/**
 * Parse Comark markdown through the real production pipeline and mount
 * the rendered React tree into `document.body` via `createRoot`. Using a
 * live React root (not `renderToStaticMarkup`) gives the interactive
 * components (tabs, code groups) their real click/keyboard handlers,
 * which is how they actually run in production via `Article`'s
 * `client:visible` island.
 *
 * Also initializes USWDS's accordion JS on the rendered content so click
 * behavior, aria-expanded toggling, and hidden-attribute management all
 * match what users get in production.
 */
export async function renderComark(markdown: string): Promise<void> {
  const tree = await parseContent(markdown)
  if (currentRoot) {
    currentRoot.unmount()
    currentRoot = null
  }
  document.body.innerHTML = ''
  const container = document.createElement('div')
  document.body.appendChild(container)
  currentRoot = createRoot(container)
  await act(async () => {
    currentRoot!.render(
      createElement(ComarkRenderer, { tree, components }),
    )
  })
  accordion.on(document.body)
}

export function unmountComark(): void {
  if (currentRoot) {
    currentRoot.unmount()
    currentRoot = null
  }
  document.body.innerHTML = ''
}
