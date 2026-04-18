---
title: Frontmatter reference
description: Every field the docsSchema accepts, with defaults and examples.
sidebar:
  order: 1
---

Every page in `src/content/docs/` starts with a YAML frontmatter block. Red Glare's `docsSchema` validates these fields at build time — unknown fields are rejected, wrong types fail the build.

## Minimal frontmatter

Only `title` is required:

```yaml
---
title: My Page
---
```

## Full schema

| Field | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | *required* | Page title. Used in `<title>`, `<h1>`, sidebar, breadcrumbs. |
| `description` | `string` | — | SEO meta + RSS description. |
| `template` | `'doc' \| 'splash' \| 'api'` | `'doc'` | Which layout to render. |
| `apiVersion` | `string` | — | Version pill on `api` template pages (e.g. `"2026-03-10"`). |
| `apiBaseUrl` | `string` | — | Reserved for future use; defined for forward compatibility. |
| `sidebar.label` | `string` | — | Custom label in the sidebar (overrides `title`). |
| `sidebar.order` | `number` | — | Numeric sort position within the sidebar group. |
| `sidebar.hidden` | `boolean` | `false` | Exclude from sidebar + prev/next. |
| `toc` | `boolean` | `true` | Render the right-column table of contents. |
| `i18n.lang` | `string` | `defaultLocale` | Page language (sets `<html lang>`). |
| `draft` | `boolean` | `false` | Skip in RSS, llms.txt, and sitemap when `true`. |

## Field-by-field

### `title`

Required. Becomes the `<h1>` on doc and api templates (splash templates don't render an auto-`<h1>`). Also used for:

- `<title>` tag (formatted as `Page Title · Site Title`).
- Sidebar item label (when no `sidebar.label` override).
- Breadcrumb label for the current page.

### `description`

Optional. SEO meta (`<meta name="description">`), OpenGraph `og:description`, Twitter `twitter:description`, and RSS item description.

If omitted, the integration falls back to the site-level `description` from `astro.config.mjs` for meta tags, and extracts the first paragraph for RSS.

### `template`

Picks the layout. Three options:

::tabs
  ::tabs-item{label="doc"}
    **Default.** Left sidebar with auto-generated navigation, center content column, right-side table of contents, breadcrumbs at the top, prev/next links at the bottom. The workhorse template for reference and guide pages.
  ::
  ::tabs-item{label="splash"}
    Full-width, no sidebar, no TOC. Designed for landing and marketing pages — think a homepage hero with feature grids. This site's home page uses `splash`.
  ::
  ::tabs-item{label="api"}
    Same layout as `doc`, but optimized for REST reference. Pages typically contain `:::endpoint` directives that render their own sticky two-column layout. An `apiVersion` frontmatter value renders a version pill next to the `<h1>`.
  ::
::

See [Templates](/authoring/templates/) for a fuller comparison.

### `apiVersion`

Only meaningful when `template: api`. Renders as a small pill next to the `<h1>`:

```yaml
---
title: Branches
template: api
apiVersion: "2026-03-10"
---
```

### `sidebar`

An object controlling this page's sidebar appearance:

```yaml
sidebar:
  label: Short name
  order: 1
  hidden: false
```

- **`label`** — overrides the sidebar item text. The `<h1>` still uses `title`.
- **`order`** — numeric position within the page's sidebar group. Lower numbers first.
- **`hidden`** — when `true`, the page isn't in the sidebar or prev/next. The URL still works; useful for redirect targets or legal boilerplate.

### `toc`

Controls the right-column table of contents. Defaults to `true`. Set to `false` to hide it on landing-style pages that don't need in-page navigation:

```yaml
toc: false
```

### `i18n.lang`

Sets the page's language. The `<html lang="...">` attribute uses this value; it also keys into the UI translation table for "Edit this page", "On this page", etc.

```yaml
i18n:
  lang: es
```

See [i18n](/configuration/i18n/).

### `draft`

When `true`:

- Excluded from RSS feed (`feed.xml`).
- Excluded from `/llms.txt` and raw `.md` endpoints.
- Excluded from sitemap.

The page still builds and is reachable at its URL — "draft" means "not yet announced," not "unpublished." Useful for staging new content before public launch.

## Example: doc page

```markdown
---
title: Filing a FOIA request
description: How to submit a Freedom of Information Act request.
sidebar:
  order: 2
---
```

## Example: splash page

```markdown
---
title: Welcome
template: splash
toc: false
---
```

## Example: API page

```markdown
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
