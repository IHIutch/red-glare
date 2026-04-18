---
title: Link button
description: USWDS-styled call-to-action link.
sidebar:
  order: 5
---

The `:::link-button` directive renders a [USWDS button](https://designsystem.digital.gov/components/button/) **as an anchor**. Prose pages rarely need a real `<button>` element, so the component only emits `<a>` — `href` is required.

## Basic usage

:::link-button{href="https://www.foia.gov/"}
Start a FOIA request
:::

```markdown
:::link-button{href="https://www.foia.gov/"}
Start a FOIA request
:::
```

## Variants

The `variant` attribute maps directly to the USWDS `usa-button--*` modifier classes:

:::link-button{href="/" variant="secondary"}
Secondary
:::

:::link-button{href="/" variant="accent-cool"}
Accent cool
:::

:::link-button{href="/" variant="accent-warm"}
Accent warm
:::

:::link-button{href="/" variant="base"}
Base
:::

:::link-button{href="/" variant="outline"}
Outline
:::

Inverse (for dark backgrounds):

<div style="background: #162e51; padding: 1rem;">

:::link-button{href="/" variant="inverse"}
Inverse
:::

</div>

```markdown
:::link-button{href="/" variant="secondary"}Secondary:::
:::link-button{href="/" variant="accent-cool"}Accent cool:::
:::link-button{href="/" variant="accent-warm"}Accent warm:::
:::link-button{href="/" variant="base"}Base:::
:::link-button{href="/" variant="outline"}Outline:::
:::link-button{href="/" variant="inverse"}Inverse:::
```

## Sizing

Pass `big` for the larger USWDS button size:

:::link-button{href="/" big}
Big primary
:::

:::link-button{href="/" variant="outline" big}
Big outline
:::

## Unstyled

`unstyled` strips the button chrome entirely — useful when you want the link functionality without the visual weight:

:::link-button{href="/" unstyled}
Unstyled link
:::

## Props reference

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `href` | `string` | *required* | Destination URL. |
| `variant` | `'secondary' \| 'accent-cool' \| 'accent-warm' \| 'base' \| 'outline' \| 'inverse'` | — | Omit for default primary. |
| `big` | `boolean` | `false` | `usa-button--big`. |
| `unstyled` | `boolean` | `false` | `usa-button--unstyled`. |
| body | markdown | — | Button text. |

## Common patterns

### Stacked CTA

:::link-button{href="/getting-started/installation/" variant="secondary" big}
Install Red Glare
:::

:::link-button{href="/components/alert/" variant="outline" big}
Browse components
:::

### Anchor jump within a page

```markdown
:::link-button{href="#installation"}
Jump to installation
:::
```

### External link with visual emphasis

```markdown
:::link-button{href="https://github.com/IHIutch/red-glare" variant="outline"}
View on GitHub
:::
```

## Why only anchors?

USWDS's `.usa-button` class works on both `<button>` and `<a>` — but prose contexts almost always want a link (navigating somewhere), not a form submit or click handler. If you need a real `<button>`, drop the directive and write raw HTML with the `usa-button` class, or build a custom component. The v1 directive scope keeps `LinkButton` anchor-only so the component doesn't try to guess your intent.

## Source

Component: [`packages/astro/src/components/LinkButton.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/LinkButton.tsx)
