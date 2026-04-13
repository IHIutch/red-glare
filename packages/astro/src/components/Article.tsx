import type { ComarkTree } from 'comark'

import { ComarkRenderer } from '@comark/react'

import { Accordion, AccordionItem } from './Accordion'
import Alert from './Alert'
import CodeGroup from './CodeGroup'
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
  'code-group': CodeGroup,
  'tabs': Tabs,
  'tabs-item': TabsItem,
  Accordion,
  AccordionItem,
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
