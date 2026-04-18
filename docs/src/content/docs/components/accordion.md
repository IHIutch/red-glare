---
title: Accordion
description: Expandable panels with deep-link support.
sidebar:
  order: 2
---

The `:::accordion` directive groups collapsible panels together. Each panel is an `::accordion-item` with its own `#heading` slot and body content.

## Basic usage

::accordion
  :::accordion-item
    #heading
    ### How do I file a FOIA request?

    #body
    Visit the FOIA portal at [foia.gov](https://www.foia.gov/) and follow the prompts. You can submit your request online or by mail.
  :::
  :::accordion-item
    #heading
    ### What is the response timeline?

    #body
    Agencies have 20 business days to respond to a FOIA request, with possible extensions for unusual circumstances.
  :::
  :::accordion-item
    #heading
    ### Are there any fees?

    #body
    Fees vary by request type. Many requests are processed at no cost.
  :::
::

```markdown
::accordion
  :::accordion-item
    #heading
    ### How do I file a FOIA request?

    #body
    Visit the FOIA portal at foia.gov...
  :::
  :::accordion-item
    #heading
    ### What is the response timeline?

    #body
    Agencies have 20 business days...
  :::
::
```

## Bordered + multiselectable

Pass `bordered` for the USWDS bordered variant, and `multiselectable` to let users open more than one panel at a time. Pass `expanded` on individual items to start them open.

::accordion{bordered multiselectable}
  :::accordion-item{expanded}
    #heading
    ### Eligibility

    #body
    This item is open by default. The accordion is bordered and allows multiple items to be open at the same time.
  :::
  :::accordion-item
    #heading
    ### How to apply

    #body
    Multi-paragraph content works inside accordion items.

    Lists, **bold**, `code`, and other markdown render normally:

    - Step one
    - Step two
    - Step three
  :::
::

```markdown
::accordion{bordered multiselectable}
  :::accordion-item{expanded}
    #heading
    ### Eligibility

    #body
    This item is open by default...
  :::
::
```

## Deep linking

Headings inside accordion content get automatic anchor IDs from `github-slugger`. When the URL's hash matches a heading **inside a collapsed panel**, the panel expands automatically and the page scrolls to that heading.

Try these links — they'll open the accordion below and scroll to the target:

- [Fee schedule](#fee-schedule-1)
- [Expedited processing](#expedited-processing-1)

::accordion{bordered}
  :::accordion-item
    #heading
    ### Fees and billing

    #body
    #### Fee schedule (1)

    Most simple requests are processed at no cost. Complex requests may incur fees for search, review, and duplication:

    | Category | Rate |
    | --- | --- |
    | Search | $33/hour |
    | Review | $55/hour |
    | Duplication | $0.10/page |

    #### Expedited processing (1)

    You may qualify for expedited processing if you can demonstrate a compelling need, such as an imminent threat to life or safety.
  :::
  :::accordion-item
    #heading
    ### Payment methods

    #body
    Accepted payment methods include check, money order, and electronic funds transfer.
  :::
::

## Props reference

### `Accordion`

| Prop | Type | Default |
| --- | --- | --- |
| `bordered` | `boolean` | `false` |
| `multiselectable` | `boolean` | `false` |

### `AccordionItem`

| Prop | Type | Default |
| --- | --- | --- |
| `expanded` | `boolean` | `false` |
| `#heading` slot | markdown | — |
| `#body` / body | markdown | — |

## Behavior notes

- The `#heading` slot becomes the clickable `<button>` inside USWDS's `.usa-accordion__heading` wrapper.
- Semantic heading level comes from the markdown you write inside `#heading` — `### Foo` keeps an `<h3>` in the document outline, and the TOC picks it up.
- `multiselectable` maps to USWDS's `data-allow-multiple` attribute, which the USWDS JS reads to decide whether to auto-collapse siblings.
- Deep-link hash expansion is handled client-side by the `accordion-hash` utility, which runs on page load and on `hashchange`.

## Source

Component: [`packages/astro/src/components/Accordion.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/Accordion.tsx)
