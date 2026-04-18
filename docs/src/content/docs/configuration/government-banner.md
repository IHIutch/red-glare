---
title: Government banner & site alert
description: The USWDS government banner and sitewide alert bar.
sidebar:
  order: 5
---

The **government banner** is the strip at the very top of federal sites ("An official website of the United States government") with an expandable "Here's how you know" explanation. The **site alert** is a separate, configurable bar directly beneath it for sitewide announcements.

## `governmentBanner`

**Type:** `boolean` · **Default:** `true`

Controls whether the USWDS government banner renders. Defaults to enabled — this is the primary visual cue that distinguishes a federal site.

```js
redGlare({
  governmentBanner: true, // default
})
```

Set to `false` for non-federal sites that still want USWDS chrome:

```js
redGlare({
  governmentBanner: false,
})
```

::alert{type="info"}
  #heading
  ### Which banner am I seeing?

  #body
  The government banner is the **gray strip with the flag icon at the very top**. The expandable "Here's how you know" content is part of that component. The site alert (below) is separate.
::

## `alert`

**Type:** `{ message, type, dismissible }` · **Optional**

A sitewide alert bar rendered below the government banner and above the header. Useful for time-sensitive announcements: scheduled maintenance, a new release, or a critical notice.

```js
redGlare({
  alert: {
    message: 'Heads up — the submission portal will be offline Sunday 2–4 AM ET.',
    type: 'warning',
    dismissible: true,
  },
})
```

### Fields

| Field | Type | Default |
| --- | --- | --- |
| `message` | `string` | *required* |
| `type` | `'info' \| 'warning' \| 'error' \| 'success'` | `'info'` |
| `dismissible` | `boolean` | `true` |

### `type`

Maps to USWDS alert variants. Same mapping as the [`::alert` directive](/components/alert/):

- **`info`** — neutral notices (default).
- **`warning`** — issues users should be aware of.
- **`error`** — problems affecting functionality.
- **`success`** — confirmations (rarely sitewide).

### `dismissible`

When `true`, the alert includes a close button and remembers its dismissed state in `sessionStorage`. Users see it once per session. Set to `false` for alerts that must persist (an urgent warning that shouldn't be hideable).

## Rendering order

Top-to-bottom, every page's header region is:

1. `<section class="usa-banner">` — government banner (if `governmentBanner: true`).
2. Site alert (if `alert` is set).
3. `<header class="usa-header">` — USWDS header with logo, title, nav, search.

## Per-page alerts

Sitewide alerts live in `astro.config.mjs`. For page-specific alerts — "this page is a draft" or "see version 2 for current guidance" — write an `::alert` directive directly in the markdown body. See [the Alert component](/components/alert/).
