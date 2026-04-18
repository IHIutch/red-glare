---
title: TOC, breadcrumbs, prev/next
description: Automatic in-page navigation chrome.
sidebar:
  order: 5
---

Red Glare's `doc` and `api` templates render four pieces of navigation chrome automatically:

- **Breadcrumbs** at the top of the page (site root → section → page).
- **Table of contents** on the right side (h2 and h3 headings with scrollspy).
- **Prev/next links** at the bottom of the page (sequential sidebar traversal).
- **Edit this page** link at the bottom (when `editLink` is configured).

None of these require authoring effort — they derive from your content and frontmatter.

## Breadcrumbs

Rendered above every `doc` or `api` page's `<h1>`. The trail is built from the page's URL path, using directory names and the page's `title` for labels.

Directory segment labels are title-cased from the folder name (`getting-started` → "Getting Started"). To override a segment's label, add an `index.md` in that folder with your preferred `title` in frontmatter — the breadcrumb picks up that title for the directory link.

## Table of contents

The right-column TOC is populated from `<h2>` and `<h3>` headings in your page. `<h1>` is excluded (it's the page title, already represented by breadcrumbs and the main heading). `<h4>` and deeper are excluded too — keeping the TOC to at most two levels prevents it from becoming a second sidebar.

### Scrollspy

The TOC highlights the heading currently visible in the viewport as you scroll. The highlight uses `IntersectionObserver` — zero layout thrash, no scroll event listeners.

### Disabling the TOC

Set `toc: false` in the page's frontmatter:

```yaml
---
title: Landing page
toc: false
---
```

The right column collapses and the content expands to fill the available width.

::alert{type="info"}
  #heading
  ### Splash pages auto-disable the TOC

  #body
  The `splash` template is already TOC-less regardless of the `toc` field. You only need `toc: false` on `doc` or `api` template pages.
::

## Prev/next links

Below every doc/api page's content, two links point to the previous and next pages in the sidebar. "Previous" and "Next" are resolved by the flattened sidebar order — walking groups top-to-bottom, respecting `sidebar.order` within each group.

Pages with `sidebar.hidden: true` are skipped in the prev/next chain. Splash-template pages are also excluded.

## Edit this page

Rendered when `editLink.baseUrl` is configured. See [Edit links](/configuration/edit-links/).

## Turning off the chrome

The chrome is part of the `doc` / `api` templates. If you need a page without any of it, switch to `template: splash`:

```yaml
template: splash
```

Splash pages render no breadcrumbs, TOC, prev/next, or edit link — just the header and footer.
