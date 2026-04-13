---
title: Components
description: Built-in components available in your markdown content
sidebar:
  order: 2
---

## Alerts

Stars and Stripes maps Comark's alert component to USWDS alerts:

::alert{type="info"}
This is an informational alert styled with USWDS.
::

::alert{type="warning"}
This is a warning alert. Pay attention to this.
::

::alert{type="success"}
Operation completed successfully!
::

::alert{type="danger"}
Something went wrong. Please check the configuration.
::

Alerts accept an optional `:::alert-heading` slot for a caption. The
slot wraps the USWDS heading treatment around whatever you write
inside, so the semantic level comes from the markdown heading itself
— use `#` through `######` to pick where the title sits in the
document outline. The TOC picks up the inner heading automatically,
with a github-slugger-generated anchor id:

::alert{type="warning"}
  The submission portal will be offline from 2:00–4:00 AM ET on Sunday while we deploy an update.

  The submission portal will be offline from 2:00–4:00 AM ET on Sunday while we deploy an update.
::

::alert{type="info"}
  :::alert-heading
  ### Filing deadline
  :::

  All responses must be received by 11:59 PM ET on the date listed in
  your notice. Late submissions cannot be accepted.
::

## Link buttons

The `:::link-button` directive renders a USWDS-styled call-to-action
link — an anchor dressed as a button. Prose pages rarely need a real
`<button>` element, so the component only emits anchors; `href` is
required. `variant` maps to any USWDS modifier (`secondary`,
`accent-cool`, `accent-warm`, `base`, `outline`, `inverse`), and
`big` / `unstyled` toggle the corresponding USWDS flags.

:::link-button{href="https://www.foia.gov/" variant="outline"}
Start a FOIA request
:::

:::link-button{href="#filing-deadline"}
Review the filing deadline
:::

:::link-button{href="/forms/waiver" variant="secondary" big}
Request a fee waiver
:::

## Summary boxes

Summary boxes highlight the most important information on a page —
often a short bulleted list of key points above a longer explanation.
Like alerts, they use a `:::summary-box-heading` slot so authors can
write a real markdown heading inside (semantic level flows from the
`#` count and the TOC picks it up automatically).

::summary-box
  :::summary-box-heading
  ### Key filing information
  :::

  - Responses are due **20 business days** after receipt of a FOIA
    request.
  - Extensions are permitted for [unusual
    circumstances](https://www.foia.gov/).
  - Fee waivers are available when disclosure is in the public
    interest.
::

## Process lists

Process lists lay out sequential steps with USWDS's numbered-circle
treatment. Each `:::process-list-item` wraps its own
`::::process-list-heading` slot for the step title, followed by the
step's body prose.

::process-list
  :::process-list-item
    ::::process-list-heading
    ### Gather supporting records
    ::::

    Collect any documents you already have that identify the records
    you're requesting — case numbers, dates, or agency names narrow
    the search.
  :::
  :::process-list-item
    ::::process-list-heading
    ### Submit your request
    ::::

    File through the [online FOIA portal](https://www.foia.gov/) or
    mail a written request to the agency's FOIA office. Include your
    contact information and a clear description of what you want.
  :::
  :::process-list-item
    ::::process-list-heading
    ### Track the response
    ::::

    Agencies have **20 business days** to acknowledge and respond.
    You'll receive a tracking number and status updates at the email
    you provided.
  :::
::

## Accordions

Accordions group expandable items together. Each `:::accordion-item`
wraps its toggle label in a `::::accordion-heading` slot where the
author writes a real markdown heading — semantic level, id, and TOC
entry all flow from the `#` count:

::accordion
  :::accordion-item
    ::::accordion-heading
    ## How do I file a FOIA request?
    ::::

    Visit the FOIA portal at [foia.gov](https://www.foia.gov/) and follow the
    prompts. You can submit your request online or by mail.
  :::
  :::accordion-item
    ::::accordion-heading
    ## What is the response timeline?
    ::::

    Agencies have 20 business days to respond to a FOIA request, with possible
    extensions for unusual circumstances.
  :::
  :::accordion-item
    ::::accordion-heading
    ## Are there any fees?
    ::::

    Fees vary by request type. Many requests are processed at no cost.
  :::
::

Pass `bordered` for the bordered USWDS variant, `multiselectable` to allow
multiple items open at once, and `expanded` on individual items to open them
by default.

::accordion{bordered multiselectable}
  :::accordion-item{expanded}
    ::::accordion-heading
    ## Eligibility
    ::::

    This item is open by default. The accordion is bordered and allows multiple
    items to be open at the same time.
  :::
  :::accordion-item
    ::::accordion-heading
    ## How to apply
    ::::

    Multi-paragraph content works inside accordion items.

    Lists, **bold**, `code`, and other markdown render normally:

    - Step one
    - Step two
    - Step three
  :::
::

### Deep linking into accordions

Headings inside accordion content get automatic IDs from
github-slugger. If a URL hash matches a heading inside a collapsed
accordion, the panel expands and the page scrolls to it. Try
clicking these links:

- [Fee schedule](#fee-schedule)
- [Expedited processing](#expedited-processing)

::accordion{bordered}
  :::accordion-item
    ::::accordion-heading
    ## Fees and billing
    ::::

    ### Fee schedule

    Most simple requests are processed at no cost. Complex requests may incur
    fees for search, review, and duplication:

    | Category | Rate |
    | --- | --- |
    | Search | $33/hour |
    | Review | $55/hour |
    | Duplication | $0.10/page |

    ### Expedited processing

    You may qualify for expedited processing if you can demonstrate a
    compelling need, such as an imminent threat to life or safety.
  :::
  :::accordion-item
    ::::accordion-heading
    ## Payment methods
    ::::

    Accepted payment methods include check, money order, and electronic
    funds transfer.
  :::
::

## Code Blocks

Syntax highlighting is built in via Shiki:

```typescript [App.vue]
import { createRender } from '@comark/html'

const render = createRender({
  plugins: [highlight()],
})

const html = await render('# Hello World')
```

::code-group

```tsx [Children]
<Comark>{content}</Comark>
```

```tsx [Markdown Prop]
<Comark markdown={content} />
```

::

Tab labels come from each block's `[filename]` bracket. When the label
includes a recognizable filename or extension, `CodeGroup` renders an
inline language icon next to it:

::code-group

```js [astro.config.mjs]
import starsAndStripes from '@starsandstripes/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [starsAndStripes({ title: 'My Agency Docs' })],
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


::tabs
  ::tabs-item{label="Vue" icon="i-logos-vue"}
    ```
    Some Vue code
    ```
  ::
  ::tabs-item{label="React" icon="i-logos-react"}
    ```
    Some react code
    ```
  ::
  ::tabs-item{label="HTML" icon="i-vscode-icons-file-type-html"}
    ```
    Some HTML code
    ```
  ::
::

## Tables

Standard markdown tables are supported:

| Feature | Status |
| ------- | ------ |
| Alerts | Supported |
| Code highlighting | Supported |
| Tables | Supported |
| Math | Supported |
| Mermaid | Supported |

## Math

Inline math: The equation $E = mc^2$ is fundamental.

Display math:

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
