import { ComarkRenderer } from '@comark/react/components/ComarkRenderer'
import accordion from '@uswds/uswds/js/usa-accordion'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

import { parseContent } from '../../comark'
import { Accordion, AccordionItem } from '../../components/Accordion'
import AccordionHeading from '../../components/AccordionHeading'
import Alert from '../../components/Alert'
import AlertHeading from '../../components/AlertHeading'
import CodeGroup from '../../components/CodeGroup'
import Endpoint from '../../components/Endpoint'
import LinkButton from '../../components/LinkButton'
import ProcessList from '../../components/ProcessList'
import ProcessListHeading from '../../components/ProcessListHeading'
import ProcessListItem from '../../components/ProcessListItem'
import SummaryBox from '../../components/SummaryBox'
import SummaryBoxHeading from '../../components/SummaryBoxHeading'
import Tabs from '../../components/Tabs'
import TabsItem from '../../components/TabsItem'

/**
 * No-op tagged template literal for markdown fixtures. Exists purely to
 * enable VS Code syntax highlighting inside the template literal via the
 * `bierner.comment-tagged-templates` extension (or similar). At runtime
 * it just returns the raw string.
 */
export const md = String.raw

const components = {
  Alert,
  'alert-heading': AlertHeading,
  'link-button': LinkButton,
  'code-group': CodeGroup,
  'endpoint': Endpoint,
  'process-list': ProcessList,
  'process-list-item': ProcessListItem,
  'process-list-heading': ProcessListHeading,
  'summary-box': SummaryBox,
  'summary-box-heading': SummaryBoxHeading,
  'tabs': Tabs,
  'tabs-item': TabsItem,
  Accordion,
  AccordionItem,
  'accordion-heading': AccordionHeading,
}

let currentRoot: ReturnType<typeof createRoot> | null = null

function resetDom(): void {
  if (currentRoot) {
    currentRoot.unmount()
    currentRoot = null
  }
  document.body.innerHTML = ''
  // Clear any lingering URL hash from the previous test so hash-based
  // tests (accordion-hash) start from a clean location.
  if (location.hash)
    history.replaceState(null, '', location.pathname + location.search)
}

/**
 * Parse Comark markdown through the real production pipeline and mount
 * the rendered tree into `document.body` via `createRoot`. Under
 * preact/compat this resolves to Preact's client renderer, but source
 * still imports from `react-dom/client` so `@comark/react` and our own
 * component code keep working unchanged.
 *
 * Tests interact with the mounted tree via `@vitest/browser`'s
 * `userEvent`, which handles event dispatching + microtask flushing
 * natively — no manual `act()` wrappers required.
 *
 * Also initializes USWDS's accordion JS on the rendered content so
 * click behavior, aria-expanded toggling, and hidden-attribute
 * management all match what users get in production.
 */
export async function renderComark(markdown: string): Promise<void> {
  resetDom()
  const tree = await parseContent(markdown)
  const container = document.createElement('div')
  document.body.appendChild(container)
  currentRoot = createRoot(container)
  currentRoot.render(
    createElement(ComarkRenderer, { tree, components }),
  )
  // Flush one microtask so the tree paints before the caller queries it.
  await Promise.resolve()
  accordion.on(document.body)
}
