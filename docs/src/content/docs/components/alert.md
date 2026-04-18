---
title: Alert
description: USWDS alert component for notices, warnings, errors, and successes.
sidebar:
  order: 1
---

The `::alert` directive renders a [USWDS alert](https://designsystem.digital.gov/components/alert/) — a bordered notice with an optional heading and a colored left rail indicating severity.

## Basic usage

::alert{type="info"}
This is an informational alert styled with USWDS.
::

```markdown
::alert{type="info"}
This is an informational alert styled with USWDS.
::
```

## Variants

::alert{type="info"}
Info — neutral notices and tips.
::

::alert{type="warning"}
Warning — pay attention to this.
::

::alert{type="error"}
Error — something went wrong.
::

::alert{type="success"}
Success — operation completed.
::

```markdown
::alert{type="info"}Info content.::
::alert{type="warning"}Warning content.::
::alert{type="error"}Error content.::
::alert{type="success"}Success content.::
```

## With a heading

Use the `#heading` named slot for a titled alert. The heading level comes from the number of `#` in the slot — the component just wraps it in USWDS's heading treatment:

::alert{type="warning"}
  #heading
  ### Heads up

  #body
  The submission portal will be offline from 2:00–4:00 AM ET on Sunday while we deploy an update.
::

```markdown
::alert{type="warning"}
  #heading
  ### Heads up

  #body
  The submission portal will be offline from 2:00–4:00 AM ET on Sunday...
::
```

::alert{type="info"}
  #heading
  ### Why a named slot?

  #body
  Authoring the heading as real markdown lets you pick the semantic level (`##` vs `###` vs `####`) to fit the surrounding document, and the github-slugger anchor id still works for deep links. A `title="..."` prop would have to synthesize all of that.
::

## Type aliases

For compatibility with other markdown conventions, the `type` attribute accepts these aliases in addition to the four canonical values:

| Alias | Maps to |
| --- | --- |
| `note` | `info` |
| `tip` | `success` |
| `important` | `warning` |
| `caution` | `error` |
| `danger` | `error` |

```markdown
::alert{type="tip"}This renders as a success alert.::
::alert{type="caution"}This renders as an error alert.::
```

Unknown values fall back to `info` — the alert renders, so a typo won't kill the build.

## ARIA live regions

By default alerts have no `role` — they're static prose elements. For alerts that appear dynamically and need to be announced to assistive tech, pass `role`:

```markdown
::alert{type="error" role="alert"}
Your session has expired. Sign in again.
::
```

- **`role="alert"`** — assertive live region. Screen readers interrupt to announce.
- **`role="status"`** — polite live region. Announced at the next natural pause.

Reserve these for alerts that are inserted into the DOM after initial render. Static prose alerts (the common case) don't need a role and shouldn't have one.

## Props reference

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `'info' \| 'warning' \| 'error' \| 'success'` (+ aliases) | `'info'` | Maps to `usa-alert--*` modifier. |
| `role` | `'alert' \| 'status'` | — | ARIA live region role. Omit for static alerts. |
| `#heading` slot | markdown | — | Optional titled heading. |
| `#body` / body | markdown | — | Alert body content. |

## Source

Component: [`packages/astro/src/components/Alert.tsx`](https://github.com/IHIutch/red-glare/blob/main/packages/astro/src/components/Alert.tsx)
