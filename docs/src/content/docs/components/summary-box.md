---
title: Summary box
description: USWDS summary box for highlighting the most important content on a page.
sidebar:
  order: 7
---

The `::summary-box` directive renders a [USWDS summary box](https://designsystem.digital.gov/components/summary-box/) — a highlighted region used to surface the most important content on a page. Typically: a short bulleted list of key points above a longer explanation.

## Basic usage

::summary-box
  #heading
  ### Key filing information

  #body
  - Responses are due **20 business days** after receipt of a FOIA request.
  - Extensions are permitted for [unusual circumstances](https://www.foia.gov/).
  - Fee waivers are available when disclosure is in the public interest.
::

```markdown
::summary-box
  #heading
  ### Key filing information

  #body
  - Responses are due **20 business days** after receipt of a FOIA request.
  - Extensions are permitted for unusual circumstances.
  - Fee waivers are available when disclosure is in the public interest.
::
```

## When to use it

Use a summary box for:

- **Executive summaries** at the top of a long page — the three-to-five bullets a skim reader needs.
- **Key takeaways** before a deep dive.
- **Important disclosures** that legally or practically can't be buried in prose.

Use an [alert](/components/alert/) instead when the content is a notice, warning, or time-sensitive message. Summary boxes are evergreen; alerts are situational.

## Accessibility

The outer element is `<div class="usa-summary-box" role="region">`. Screen readers announce it as a landmark region using the inner heading as its accessible name — no `aria-labelledby` pairing needed, because the heading is a descendant of the region.

This is why the `#heading` slot matters even more here than on `<Alert>`: without a heading, the landmark has no name and becomes invisible in a screen reader's region list.

::alert{type="info"}
  #heading
  ### Always include a heading

  #body
  A summary box without a `#heading` still renders visually, but it loses its accessible landmark name. If you're reaching for this component, include a heading.
::

## Without a heading

You *can* omit the `#heading` slot — the component will skip the heading wrapper. But you lose the landmark semantics (see above), so this is rarely what you want:

::summary-box
  #body
  A summary box without a heading — still visually distinct, but less useful to assistive tech.
::

## Props reference

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `#heading` slot | markdown | — | Strongly recommended. |
| `#body` / body | markdown | — | Summary content. |

## Source

Component: [`packages/astro/src/components/SummaryBox.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/SummaryBox.tsx)
