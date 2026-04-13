import type { ComarkTree } from 'comark'

// Deep import bypasses `@comark/react`'s index, which re-exports a
// `ComarkClient` that depends on React 19's `use()` hook. `preact/compat`
// doesn't implement `use`, so hitting the top-level entry breaks the
// preact/compat build.
import { ComarkRenderer } from '@comark/react/components/ComarkRenderer'

import { Accordion, AccordionItem } from './Accordion'
import AccordionHeading from './AccordionHeading'
import Alert from './Alert'
import AlertHeading from './AlertHeading'
import CodeGroup from './CodeGroup'
import LinkButton from './LinkButton'
import ProcessList from './ProcessList'
import ProcessListHeading from './ProcessListHeading'
import ProcessListItem from './ProcessListItem'
import SummaryBox from './SummaryBox'
import SummaryBoxHeading from './SummaryBoxHeading'
import Tabs from './Tabs'
import TabsItem from './TabsItem'

interface ArticleProps {
  tree: ComarkTree
  className?: string
}

// Component map lives here rather than in the `.astro` route so it doesn't
// have to cross the client-island serialization boundary. Astro can
// serialize `tree` (plain JSON arrays) but not React component references,
// so we import them inside the island module and only accept data props.
const components = {
  Alert,
  'alert-heading': AlertHeading,
  'link-button': LinkButton,
  'code-group': CodeGroup,
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

/**
 * Client-side entry point for rendering a parsed Comark tree. Mounted
 * from the slug route with `client:visible` so the interactive pieces
 * (tabs, code groups, accordions) hydrate with real React state.
 */
export default function Article({ tree, className }: ArticleProps) {
  return (
    <ComarkRenderer
      tree={tree}
      components={components}
      className={className}
    />
  )
}
