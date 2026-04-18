---
title: Code group
description: Tabbed code blocks for language or tool alternatives.
sidebar:
  order: 3
---

The `::code-group` directive groups multiple code blocks into a tabbed view. Each child code block's tab label comes from its `[bracket]` filename/label.

## Basic usage

::code-group
```bash [pnpm]
pnpm add @red-glare/astro
```
```bash [npm]
npm install @red-glare/astro
```
```bash [yarn]
yarn add @red-glare/astro
```
::

````markdown
::code-group
```bash [pnpm]
pnpm add @red-glare/astro
```
```bash [npm]
npm install @red-glare/astro
```
```bash [yarn]
yarn add @red-glare/astro
```
::
````

## File-aware labels + icons

When a bracket label looks like a filename or has a recognizable extension, the tab renders with a matching language icon (from Iconify's Lucide / Logos / VS Code Icons sets):

::code-group
```js [astro.config.mjs]
import redGlare from '@red-glare/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [redGlare({ title: 'My Agency Docs' })],
})
```

```json [package.json]
{
  "name": "my-agency-docs",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

```css [src/styles.css]
.usa-prose h2 {
  color: var(--usa-color-primary-dark);
}
```
::

## Language-only labels

If the bracket is just a label (no file extension), no icon is rendered — you get a plain text tab:

::code-group
```tsx [Children]
<Comark>{content}</Comark>
```
```tsx [Markdown Prop]
<Comark markdown={content} />
```
::

## Keyboard navigation

The tab list implements the [WAI-ARIA Authoring Practices tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next tab, wraps around |
| `Home` | First tab |
| `End` | Last tab |
| `Enter` / `Space` | Activate focused tab |

Tabs use `aria-selected`, `aria-controls`, and `tabindex="-1"` on inactive tabs — only the active tab is in the focus order.

## Props reference

### `::code-group`

| Prop | Type | Default |
| --- | --- | --- |
| `children` | fenced code blocks | — |

### Child code blocks

Attributes come from the fenced block's `[bracket]` label:

| Attribute | Source | Purpose |
| --- | --- | --- |
| `filename` | `[path/to/file.ext]` | Tab label; also keys the language icon. |
| `label` | `[Display label]` | Fallback tab label when no filename. |

The parser resolves `iconData` automatically from the filename when it matches a known language.

## Source

Component: [`packages/astro/src/components/CodeGroup.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/CodeGroup.tsx)

Language icon map: [`packages/astro/src/components/lang-icons.ts`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/lang-icons.ts)
