---
title: Directive syntax
description: How MDC directives work and when to use them.
sidebar:
  order: 3
---

Directives are Red Glare's in-markdown way to render structured components without leaving CommonMark. Built on the [MDC (Markdown Components)](https://content.nuxt.com/docs/files/markdown#mdc-syntax) syntax, they look like this:

```markdown
::alert{type="info"}
This is an informational alert.
::
```

And render as:

::alert{type="info"}
This is an informational alert.
::

## The three forms

### 1. Inline / block without children

Two-colon fence `::name{attrs}`...`::` wraps a block of markdown body:

```markdown
::summary-box
Key information lives here.
::
```

### 2. With named slots

Use `#slot-name` inside the directive body to fill named slots (like the `#heading` on [alerts](/components/alert/)):

```markdown
::alert{type="warning"}
  #heading
  ### Warning title

  #body
  Body content goes here.
::
```

Named slots are converted by `@comark/react` into props prefixed with `slot` + PascalCase (`#heading` → `slotHeading`).

### 3. With nested directives

When a directive's body contains **other** directives, use three colons for the outer fence and two for the inner — bump the fence count by one for each level of nesting:

```markdown
:::accordion
  ::accordion-item
    #heading
    ### Section title

    #body
    Section content.
  ::
:::
```

The containing directive needs at least one more colon than anything it contains. The parser uses the colon count to disambiguate nesting — if it confuses the fences, your directive will fail to parse or leak content into adjacent blocks.

::alert{type="info"}
  #heading
  ### Quick rule of thumb

  #body
  Two colons for leaves. Three for containers of leaves. Four for containers of containers (rare).
::

## Attribute syntax

Attributes appear in `{...}` after the directive name:

```markdown
::alert{type="warning" role="alert"}
Urgent message.
::
```

- **Strings**: quoted with single or double quotes.
- **Booleans**: bare attribute name = `true`. `::accordion{bordered multiselectable}` sets both to `true`.
- **Numbers**: bare numeric tokens. `::process-list{start=5}` passes `5` as a number.

Unknown attributes are passed through to the component, so the directive pipeline doesn't gatekeep — but unknown *directives* fall through as literal text.

## What directives are available?

Red Glare ships these out of the box:

| Directive | Component | Docs |
| --- | --- | --- |
| `::alert` | USWDS alert | [Alert](/components/alert/) |
| `:::accordion` / `::accordion-item` | USWDS accordion | [Accordion](/components/accordion/) |
| `::code-group` | Tabbed code blocks | [Code group](/components/code-group/) |
| `:::endpoint` | REST endpoint reference | [Endpoint](/components/endpoint/) |
| `:::link-button` | USWDS call-to-action link | [Link button](/components/link-button/) |
| `::process-list` / `:::process-list-item` | USWDS numbered steps | [Process list](/components/process-list/) |
| `::summary-box` | USWDS summary callout | [Summary box](/components/summary-box/) |
| `::tabs` / `::tabs-item` | Generic tab panels | [Tabs](/components/tabs/) |

## Live examples

Each component page has rendered examples. A small taste here:

::summary-box
  #heading
  ### One-line summary

  #body
  Directives make structured content readable in plain markdown — no JSX imports, no layout gymnastics. Any markdown editor can edit them.
::

::process-list
  :::process-list-item
    #heading
    ### Write the directive

    #body
    Open the markdown file and drop in `::name{attrs}` ... `::`.
  :::
  :::process-list-item
    #heading
    ### Preview it

    #body
    `astro dev` renders the directive as soon as you save.
  :::
  :::process-list-item
    #heading
    ### Ship it

    #body
    The directive compiles to static HTML at build time. No runtime cost.
  :::
::

## Custom directives

Red Glare's directive pipeline is built on [`comark`](https://comark.dev) plugins. Adding project-specific directives is possible by extending the pipeline, but that's not a v1 authoring surface — components you can register from user-land will come in a future release.

If you need a custom block type today, file a feature request on the [repo](https://github.com/IHIutch/red-glare/issues).
