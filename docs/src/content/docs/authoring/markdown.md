---
title: Markdown features
description: What CommonMark features Comark supports out of the box.
sidebar:
  order: 2
---

Pages are parsed by [Comark](https://comark.dev) — a CommonMark-compliant parser with a plugin pipeline. Red Glare configures Comark with a curated set of plugins, so the markdown features below work everywhere without additional setup.

## Headings

Standard ATX headings (`#` through `######`). Every heading gets an automatic `id` via [`github-slugger`](https://github.com/Flet/github-slugger), so deep links work and the TOC can anchor to any heading.

```markdown
## Overview

The `Overview` heading is reachable at `#overview`.
```

Heading levels drive the right-column table of contents — only `<h2>` and `<h3>` headings appear there, by design.

## Paragraphs, emphasis, lists

CommonMark standard:

```markdown
**Bold**, *italic*, `inline code`, and [links](https://example.com).

- Unordered list
- Items

1. Ordered list
2. Items
```

## Tables

GitHub-flavored pipe tables work:

```markdown
| Feature | Status |
| --- | --- |
| Alerts | Supported |
| Tables | Supported |
```

Renders as:

| Feature | Status |
| --- | --- |
| Alerts | Supported |
| Tables | Supported |

## Code blocks

Fenced code blocks with a language hint are syntax-highlighted at **parse time** via [Shiki](https://shiki.style). No client-side highlighting — the server emits pre-rendered HTML.

````markdown
```typescript
interface User {
  id: string
  email: string
}
```
````

Themes: GitHub Light (default) and GitHub Dark (when the user's OS is in dark mode).

### Filenames and labels

Add a `[bracket]` after the language to label a block. The label renders above the code, and tabbed [code groups](/components/code-group/) use it as the tab title:

````markdown
```ts [src/api.ts]
export async function getUser(id: string) {
  return fetch(`/api/users/${id}`)
}
```
````

## Links

Internal and external links are standard markdown:

```markdown
[Browse components](/components/alert/)
[View on GitHub](https://github.com/IHIutch/red-glare)
```

Internal links are **validated at build time** — see [Link validator](/features/link-validator/).

## Images

Standard markdown image syntax:

```markdown
![Alt text](/assets/screenshot.png)
```

Place images in `public/assets/` (or anywhere under `public/`). Relative paths are resolved from the page's source file — useful for colocated screenshots.

## Math

Inline math uses single `$`:

```markdown
The equation $E = mc^2$ is fundamental.
```

Renders as: The equation $E = mc^2$ is fundamental.

Display math uses double `$$`:

```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

Renders as:

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Math is rendered server-side with KaTeX.

## Summary cut

Place `<!-- more -->` anywhere in a page to mark where the "summary" ends. The content before this marker is extracted for:

- RSS feed item summaries.
- Splash-template hero excerpts (everything before the cut is the lede).
- Future: search snippets, social card previews.

```markdown
---
title: Big announcement
---

We're launching a new portal next month.

<!-- more -->

## Full details

(The rest of the content continues here.)
```

## Directive components

Red Glare's signature feature: **MDC directives** for structured content like alerts, accordions, code groups, and API endpoints. They're covered in their own [Directives](/authoring/directives/) page.

## What's not included

To keep the pipeline predictable, a few commonly-bundled features are **not** enabled:

- **Mermaid diagrams** — considered out of scope for v1; track the PRD for updates.
- **Raw HTML passthrough** — HTML in markdown is safe-escaped by Comark. Use directive components or file a request for a specific pattern.
- **Front-of-line YAML in code blocks** — the `[filename]` bracket is the supported metadata channel.
