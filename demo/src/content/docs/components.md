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

## Code Blocks

Syntax highlighting is built in via Shiki:

```typescript
import { createRender } from '@comark/html'

const render = createRender({
  plugins: [highlight()],
})

const html = await render('# Hello World')
```

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
