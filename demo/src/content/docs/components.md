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

## Accordions

Accordions group expandable items together. Use the `accordion` directive to
wrap one or more `accordion-item` directives. Each item's `title` attribute is
the (text-only) heading shown on the toggle button.

::accordion
  :::accordion-item{title="How do I file a FOIA request?"}
  Visit the FOIA portal at [foia.gov](https://www.foia.gov/) and follow the
  prompts. You can submit your request online or by mail.
  :::
  :::accordion-item{title="What is the response timeline?"}
  Agencies have 20 business days to respond to a FOIA request, with possible
  extensions for unusual circumstances.
  :::
  :::accordion-item{title="Are there any fees?"}
  Fees vary by request type. Many requests are processed at no cost.
  :::
::

Pass `bordered` for the bordered USWDS variant, `multiselectable` to allow
multiple items open at once, and `expanded` on individual items to open them
by default.

::accordion{bordered multiselectable}
  :::accordion-item{title="Eligibility" expanded}
  This item is open by default. The accordion is bordered and allows multiple
  items to be open at the same time.
  :::
  :::accordion-item{title="How to apply"}
  Multi-paragraph content works inside accordion items.

  Lists, **bold**, `code`, and other markdown render normally:

  - Step one
  - Step two
  - Step three
  :::
::

### Deep linking into accordions

Headings inside accordion content get automatic IDs from Comark. If a URL
hash matches a heading inside a collapsed accordion, the panel expands and
the page scrolls to it. Try clicking these links:

- [Fee schedule](#fee-schedule)
- [Expedited processing](#expedited-processing)

::accordion{bordered}
  :::accordion-item{title="Fees and billing"}
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
  :::accordion-item{title="Payment methods"}
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


::tabs{class="gap-0"}
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
