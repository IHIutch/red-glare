---
"@red-glare/astro": minor
---

First iteration beyond the initial publish. Bundles five meaningful changes that accumulated while building the `red-glare.dev` docs site:

- **feat:** `hero` + `features` frontmatter for the `splash` template. Landing pages can declare a dark-band hero (eyebrow, headline, tagline, action buttons) and a USWDS card-group feature grid directly in frontmatter — no directive or layout override needed. Shape follows VitePress conventions but maps to USWDS tokens throughout. `feature.linkText` is required for a card's CTA to render so repeated "Learn more" labels don't happen by accident.
- **fix:** `parseContent` now accepts `undefined` markdown. Frontmatter-only pages used to crash with `Cannot read properties of undefined (reading 'startsWith')` because Astro's content collection returns `body: undefined` when there's nothing after the closing `---` and comark's internal `parseFrontmatter` calls `.startsWith` unconditionally.
- **fix:** `Search.astro` now actually loads `PagefindUI` by importing `@pagefind/default-ui` directly. The previous version referenced `window.PagefindUI` but nothing on the page ever populated that global — `astro-pagefind` only runs the indexer at build time, it doesn't ship the runtime UI. Search was silently broken in `0.0.1`.
- **fix:** Breadcrumbs and the sidebar stop generating 404 links. Intermediate breadcrumb segments without a backing page render as `<span>` instead of an anchor. The sidebar recognizes `<group>/index.md` as a group's landing page (via its frontmatter `title`/`sidebar.label`/`sidebar.order`) and stops double-rendering it as both a top-level item and a group header.
- **fix:** 14 extra Shiki languages preloaded (`css`, `scss`, `sass`, `html`, `xml`, `ini`, `jsonc`, `toml`, `dockerfile`, `go`, `rust`, `python`, `shellscript`, `sql`). Comark's default language list covers 10 languages — anything else used to log `Language X not found, you may need to load it first` during the build.
- **perf:** Variable-font woff2 files preloaded via `<link rel="preload">` to mitigate flash-of-unstyled-text on cold loads.
