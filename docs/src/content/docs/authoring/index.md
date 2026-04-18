---
title: Authoring
description: Write markdown content for a Red Glare site.
sidebar:
  order: 3
---

Red Glare uses [Comark](https://comark.dev) for content parsing — a CommonMark-compliant parser with a plugin pipeline. Pages are plain markdown files in `src/content/docs/`, with a YAML frontmatter block validated against `docsSchema`.

## In this section

- **[Frontmatter](/authoring/frontmatter/)** — every field the schema accepts, with defaults and examples.
- **[Markdown features](/authoring/markdown/)** — what CommonMark features Comark supports out of the box.
- **[Directive syntax](/authoring/directives/)** — MDC directives for alerts, accordions, code groups, and more.
- **[Page templates](/authoring/templates/)** — the `doc`, `splash`, and `api` templates and when to use each.
