---
title: Page templates
description: The doc, splash, and api templates and when to use each.
sidebar:
  order: 4
---

Every page declares its layout via the `template` frontmatter field. Three templates ship with Red Glare.

## `doc` (default)

The standard documentation template. Use for reference pages, guides, concept explanations — the vast majority of content.

**Layout:**

- Left column — auto-generated sidebar navigation.
- Center column — article body with prose styling, breadcrumbs at the top, edit link and prev/next at the bottom.
- Right column — scrollspy table of contents (h2 and h3 headings).

**Frontmatter:**

```yaml
---
title: Page title
description: Optional SEO description.
sidebar:
  order: 1
---
```

## `splash`

Full-width marketing/landing layout. No sidebar, no TOC, no prev/next. Use for:

- Homepages.
- Section index pages that function as landing pages.
- Mini-campaigns ("the new API is live" pages).

**Layout:**

- Full content width, centered with USWDS's content-area max width.
- No auto-rendered `<h1>` — you control the visual hierarchy.
- Great with `:::link-button` directives for CTAs and `::summary-box` for feature highlights.

**Frontmatter:**

```yaml
---
title: Welcome
template: splash
toc: false
---
```

This site's [home page](/) uses the splash template.

## `api`

Same overall shell as `doc`, specialized for REST reference. Uses:

- An optional `apiVersion` frontmatter value for the version pill next to the `<h1>`.
- The [`:::endpoint`](/components/endpoint/) directive, which renders a sticky two-column layout per endpoint (parameters + responses left, request/response examples right).

**Frontmatter:**

```yaml
---
title: Branches
description: List, retrieve, and manage repository branches.
template: api
apiVersion: "2026-03-10"
sidebar:
  label: API — Branches
  order: 4
---
```

See [API endpoint example](/reference/api-endpoint-example/) for a full worked example.

## Picking a template

::tabs{aria-label="Template selection"}
  ::tabs-item{label="Writing a concept page?"}
    Use **`doc`**. You want the sidebar for context, the TOC for in-page navigation, and the edit link for contributions.
  ::
  ::tabs-item{label="Writing a landing page?"}
    Use **`splash`**. Full-width canvas, CTAs with `:::link-button`, summary boxes for feature highlights.
  ::
  ::tabs-item{label="Writing REST reference?"}
    Use **`api`** with one or more `:::endpoint` directives. You get the sidebar for navigation between endpoints plus the specialized endpoint layout.
  ::
::

## Mix and match

You can mix templates freely in the same site. The sidebar is template-agnostic — a `splash` landing page can sit in the same sidebar group as `doc` pages, and an `api` page can appear inside a top-level "Reference" section.

The frontmatter picks the template per-file, not per-directory.

::alert{type="info"}
  #heading
  ### One template per page

  #body
  A page can't switch templates halfway through. Decide at the frontmatter level; use directive components inside the body for smaller layout shifts (summary boxes, accordions, etc.).
::
