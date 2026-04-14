import type { ReactNode } from 'react'

interface TabsItemProps {
  label?: string
  icon?: string
  description?: string
  children?: ReactNode
}

/**
 * Single panel inside a `<Tabs>` group. Only the `children` are rendered —
 * `label`, `icon`, and `description` are read off the React element by the
 * parent `Tabs` component to build the tab strip. This wrapper just scopes
 * a `<div>` around the panel content so author-level styling hooks work.
 */
export default function TabsItem({ children, description }: TabsItemProps) {
  return (
    <div className="rg-tabs__item">
      {children ?? (description && <p>{description}</p>)}
    </div>
  )
}
