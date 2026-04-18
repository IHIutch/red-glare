---
title: Tabs
description: Generic tab panels for grouping equivalent content.
sidebar:
  order: 8
---

The `::tabs` directive renders a set of tab panels for equivalent-but-alternative content. If your tabs contain only code blocks, reach for [code group](/components/code-group/) instead — it's a specialized, simpler directive for that case.

## Basic usage

::tabs
  ::tabs-item{label="npm"}
    Install with npm:

    ```bash
    npm install @red-glare/astro
    ```
  ::
  ::tabs-item{label="pnpm"}
    Install with pnpm:

    ```bash
    pnpm add @red-glare/astro
    ```
  ::
  ::tabs-item{label="yarn"}
    Install with yarn:

    ```bash
    yarn add @red-glare/astro
    ```
  ::
::

```markdown
::tabs
  ::tabs-item{label="npm"}
    Install with npm:

    ```bash
    npm install @red-glare/astro
    ```
  ::
  ::tabs-item{label="pnpm"}
    Install with pnpm:

    ```bash
    pnpm add @red-glare/astro
    ```
  ::
::
```

## With icons

`icon` accepts any Iconify reference string (e.g. `i-logos-vue`, `i-logos-react`, `i-vscode-icons-file-type-html`). The icon is resolved at parse time and inlined as an SVG in the tab button.

::tabs
  ::tabs-item{label="Vue" icon="i-logos-vue"}
    Vue-flavored content goes here.
  ::
  ::tabs-item{label="React" icon="i-logos-react"}
    React-flavored content goes here.
  ::
  ::tabs-item{label="HTML" icon="i-vscode-icons-file-type-html"}
    HTML-flavored content goes here.
  ::
::

### Available icon sets

Red Glare ships these Iconify sets pre-bundled:

- `i-lucide-*` — [Lucide](https://lucide.dev) general-purpose icons.
- `i-logos-*` — [Logos](https://github.com/gilbarbara/logos) tech logos (React, Vue, etc.).
- `i-vscode-icons-*` — [VS Code Icons](https://github.com/vscode-icons/vscode-icons) file-type icons.

Any other set requires pulling in the corresponding `@iconify-json/*` package and extending the resolver.

## Accessibility

Implements the [WAI-ARIA Authoring Practices tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

- `role="tablist"` on the container.
- `role="tab"` on each button with `aria-selected` and `aria-controls`.
- `role="tabpanel"` on each panel with `aria-labelledby`.
- Only the active tab is in the focus order (`tabindex="0"` on active, `-1` on others).

Keyboard navigation:

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next tab, wraps around |
| `Home` | First tab |
| `End` | Last tab |
| `Enter` / `Space` | Activate the focused tab |

Pass `aria-label` on the outer directive to name the tab group when more than one tab group appears on a page:

```markdown
::tabs{aria-label="Install with your package manager"}
  ::tabs-item{label="npm"}...:::
  ::tabs-item{label="pnpm"}...:::
::
```

## Props reference

### `::tabs`

| Prop | Type | Default |
| --- | --- | --- |
| `aria-label` | `string` | `"Tabs"` |

### `::tabs-item`

| Prop | Type | Default |
| --- | --- | --- |
| `label` | `string` | item index |
| `icon` | Iconify reference string | — |
| `description` | `string` | — (fallback panel content if body is empty) |

## When to use tabs vs. code-group

| Situation | Reach for |
| --- | --- |
| Three install command variants (pnpm, npm, yarn) | [`::code-group`](/components/code-group/) |
| A config file shown in JS and TS | [`::code-group`](/components/code-group/) |
| "Vue vs. React" where each tab has prose + a code sample | `::tabs` |
| Swapping between prose alternatives with no code | `::tabs` |

Code group is narrower — it expects each child to be a fenced code block and pulls the label from the `[bracket]` syntax. Tabs is the generic fallback.

## Source

Components: [`packages/astro/src/components/Tabs.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/Tabs.tsx), [`TabsItem.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/TabsItem.tsx)
