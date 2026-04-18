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
| `hero` | `Hero` | — | Splash-template hero band. See below. |
| `features` | `Feature[]` | — | Splash-template feature grid. See below. |
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

### `hero` & `features` (splash template only)

`splash`-template pages accept a structured `hero` block and an optional `features` array in frontmatter. Both render above the markdown body — authors don't need directives or component imports to lay out a landing page.

```yaml
---
title: Welcome
template: splash
hero:
  text: Let's build docs sites together  # main <h1>
  tagline: One-line description.         # optional lede
  image:                                 # optional
    src: /hero.svg
    alt: Mascot
  actions:
    - text: Get started
      link: /getting-started/installation/
    - text: Browse components
      link: /components/alert/
      variant: outline
      outline: true
    - text: View on GitHub
      link: https://github.com/example/repo
      variant: inverse
      external: true
features:
  - icon: 🏛️
    title: USWDS out of the box
    details: Real government banner, header, identifier, footer.
    link: /configuration/overview/        # optional "Learn more" button
  - icon: ✍️
    title: Markdown-first
    details: CommonMark via Comark, plus MDC directives.
---
```

#### `hero` fields

| Field | Type | Purpose |
| --- | --- | --- |
| `name` | `string` | Optional pre-title "eyebrow" line. |
| `text` | `string` | Required. Main headline, rendered as `<h1>`. |
| `tagline` | `string` | Optional lede paragraph. |
| `image.src` | `string` | Optional hero image. |
| `image.alt` | `string` | Image alt text. Leave empty for decorative images. |
| `actions` | `HeroAction[]` | Optional button group. |

#### `HeroAction` fields

| Field | Type | Purpose |
| --- | --- | --- |
| `text` | `string` | Button label. |
| `link` | `string` | Destination URL (internal or external). |
| `variant` | `'secondary' \| 'accent-cool' \| 'accent-warm' \| 'base' \| 'outline' \| 'inverse'` | USWDS button variant. Omit for primary. |
| `outline` | `boolean` | Adds `usa-button--outline` on top of the variant. |
| `big` | `boolean` | Render as the `big` USWDS button. |
| `external` | `boolean` | Opens in a new tab with `rel="noopener noreferrer"`. |

#### `features` fields

Each feature is a card. All fields are plain strings — no markdown expansion inside `details`, keep it one-liner copy.

| Field | Type | Purpose |
| --- | --- | --- |
| `icon` | `string` | Emoji or single character rendered above the title. |
| `title` | `string` | Required. Card heading. |
| `details` | `string` | Required. Card body copy. |
| `link` | `string` | Optional call-to-action link. Requires `linkText` to render. |
| `linkText` | `string` | Call-to-action label. Use a specific verb per card — a page of cards all reading "Learn more" is a weaker signal than distinct labels. |

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
