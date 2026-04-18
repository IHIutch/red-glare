---
title: Process list
description: USWDS numbered steps with the circle-and-line visual treatment.
sidebar:
  order: 6
---

The `::process-list` directive renders a [USWDS process list](https://designsystem.digital.gov/components/process-list/) — an ordered list of numbered steps with connector lines between them. Each step is a `:::process-list-item` with a `#heading` slot for the step title and a body for the description.

## Basic usage

::process-list
  :::process-list-item
    #heading
    ### Gather supporting records

    #body
    Collect any documents you already have that identify the records you're requesting — case numbers, dates, or agency names narrow the search.
  :::
  :::process-list-item
    #heading
    ### Submit your request

    #body
    File through the [online FOIA portal](https://www.foia.gov/) or mail a written request to the agency's FOIA office.
  :::
  :::process-list-item
    #heading
    ### Track the response

    #body
    Agencies have **20 business days** to acknowledge and respond. You'll receive a tracking number and status updates at the email you provided.
  :::
::

```markdown
::process-list
  :::process-list-item
    #heading
    ### Gather supporting records

    #body
    Collect any documents you already have...
  :::
  :::process-list-item
    #heading
    ### Submit your request

    #body
    File through the online FOIA portal...
  :::
::
```

## How the numbering works

USWDS handles the numbered circles and connector lines entirely via CSS — `:nth-child` selectors on `.usa-process-list__item` and a pseudo-element for the circle. The component is just a styled `<ol>` with `<li>` children.

This means:

- **Numbers are automatic.** You can't start at a custom number.
- **Reordering is just reordering markdown.** Drag items around in the source; the numbers update.
- **The last item has no trailing connector line.** CSS handles it via `:last-child`.

## Rich content inside steps

The body accepts any markdown — lists, tables, code blocks, directive components:

::process-list
  :::process-list-item
    #heading
    ### Prepare your environment

    #body
    You'll need:

    - Node.js 20+
    - A package manager (pnpm, npm, or yarn)
    - An Astro 6 project

    If you're starting from scratch:

    ```bash
    pnpm create @red-glare my-docs
    ```
  :::
  :::process-list-item
    #heading
    ### Configure the integration

    #body
    ::alert{type="info"}
    The minimum configuration is just a `title`. Everything else has sensible defaults.
    ::

    Add to `astro.config.mjs`:

    ```js
    import redGlare from '@red-glare/astro'

    export default defineConfig({
      integrations: [redGlare({ title: 'My Docs' })],
    })
    ```
  :::
::

## Props reference

### `::process-list`

No props. The `<ol class="usa-process-list">` wrapper is rendered unconditionally.

### `::process-list-item`

| Prop | Type | Default |
| --- | --- | --- |
| `#heading` slot | markdown | — |
| `#body` / body | markdown | — |

## Source

Components: [`packages/astro/src/components/ProcessList.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/ProcessList.tsx), [`ProcessListItem.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/ProcessListItem.tsx)
