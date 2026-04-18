---
title: Navigation
description: Header nav, sidebar auto-generation, and per-page overrides.
sidebar:
  order: 3
---

Red Glare has two independent navigation surfaces: the **header nav** (top of every page, USWDS-style) and the **sidebar** (left column on doc and api templates). Both can be auto-generated from the file tree, and both can be taken over explicitly via config.

## Header nav (`nav`)

**Type:** `NavItem[]` · **Optional** · Derived from `sidebar` if omitted.

Each item is either a flat link or a dropdown:

```ts
type NavItem
  = | { label: string, href: string }
    | { label: string, items: Array<{ label: string, href: string }> }
```

```js
redGlare({
  nav: [
    { label: 'Getting Started', href: '/getting-started/' },
    {
      label: 'Reference',
      items: [
        { label: 'Components', href: '/components/alert/' },
        { label: 'Configuration', href: '/configuration/overview/' },
        { label: 'Deployment', href: '/deployment/cloudflare-workers/' },
      ],
    },
    { label: 'About', href: '/about/' },
  ],
})
```

Dropdown items render as USWDS megamenu panels. The active state is matched on path prefix — `/components/alert/` lights up the `Reference` dropdown when the user is on any `/components/*` page.

## Sidebar

The sidebar on `doc` and `api` template pages is auto-generated from your `src/content/docs/` tree by default. For most sites you can leave `sidebar` unset and rely on frontmatter ordering.

### Auto-generation rules

- **Groups** come from subdirectories. `src/content/docs/guides/setup.md` joins a "Guides" group.
- **Group labels** are title-cased from the directory name (`getting-started` → "Getting Started").
- **Item labels** come from `sidebar.label` (frontmatter) or `title` if unset.
- **Ordering** inside a group is controlled by `sidebar.order` (numeric, ascending). Items without `order` sort alphabetically after ordered ones.
- **`sidebar.hidden: true`** skips an item in the sidebar (but the page still exists).

```markdown [src/content/docs/guides/setup.md]
---
title: Setup Guide
sidebar:
  label: Setup
  order: 1
---
```

### Explicit `sidebar` config

Pass `sidebar: SidebarGroup[]` in config to take over:

```ts
type SidebarGroup = {
  label: string
  items?: Array<string | SidebarGroup>   // string = slug (e.g. 'guides/setup')
  autogenerate?: { directory: string }   // auto-fill from a subtree
  collapsed?: boolean                     // render collapsed by default
}
```

```js
redGlare({
  sidebar: [
    {
      label: 'Getting started',
      items: ['getting-started/installation', 'getting-started/quickstart'],
    },
    {
      label: 'Guides',
      autogenerate: { directory: 'guides' },
      collapsed: true,
    },
  ],
})
```

- **Strings** in `items` are slugs (no leading `/`, no trailing `/`, no `.md`).
- **Nested `SidebarGroup` objects** in `items` let you build multi-level trees.
- **`autogenerate`** fills a group from a subtree — useful when you want hand-ordered top-level groups but auto-populated leaves.

## Per-page sidebar control

Inside any `.md` file, the frontmatter `sidebar` object fine-tunes how that page appears in the nav:

```yaml
sidebar:
  label: Custom label   # Overrides the title in the sidebar
  order: 2              # Numeric sort position
  hidden: true          # Exclude from sidebar and prev/next
```

See [Frontmatter](/authoring/frontmatter/) for the full schema.

## Putting it together

::accordion
  :::accordion-item{expanded}
    #heading
    ### Small site — everything automatic

    #body
    Skip both `nav` and `sidebar` entirely. The header nav becomes a flat list of top-level sidebar groups; the sidebar is derived from the file tree.
  :::
  :::accordion-item
    #heading
    ### Medium site — custom header, auto sidebar

    #body
    Set `nav` by hand (usually with a couple of dropdowns), leave `sidebar` unset, and steer per-page ordering via frontmatter `sidebar.order`.
  :::
  :::accordion-item
    #heading
    ### Large site — explicit sidebar tree

    #body
    Declare `sidebar` with nested groups, mix `items` strings with `autogenerate` for mature subtrees.
  :::
::
