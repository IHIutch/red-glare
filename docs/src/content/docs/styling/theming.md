---
title: Theming
description: Customize USWDS tokens, colors, and typography.
sidebar:
  order: 1
---

Red Glare is built on the [USWDS Sass theming system](https://designsystem.digital.gov/documentation/developers/). To customize colors, fonts, or spacing, override USWDS tokens in a settings file and point the integration at it.

## `uswdsSettings` config

**Type:** `string` · **Optional**

Path to a Sass file (typically `src/styles/uswds-settings.scss`) that overrides USWDS tokens. Relative to the project root.

```js
redGlare({
  uswdsSettings: 'src/styles/uswds-settings.scss',
})
```

## Example settings file

```scss [src/styles/uswds-settings.scss]
@use "uswds-core" with (
  $theme-color-primary:            "blue-60v",
  $theme-color-primary-dark:       "blue-70v",
  $theme-color-primary-darker:     "blue-80v",
  $theme-color-secondary:          "red-cool-50v",
  $theme-color-accent-cool:        "cyan-40v",
  $theme-color-accent-warm:        "orange-30v",

  $theme-font-type-sans:           "public-sans",
  $theme-font-type-serif:          "merriweather",
  $theme-font-type-mono:           "roboto-mono",

  $theme-font-role-body:           "sans",
  $theme-font-role-heading:        "sans",
  $theme-font-role-code:           "mono",

  $theme-respect-user-font-size:   true,
  $theme-show-notifications:       false,
  $theme-show-compile-warnings:    false
);
```

## Token categories

USWDS exposes tokens across several categories. The most-reached-for ones:

### Colors

- `$theme-color-primary` — main brand color, used by buttons, links, focus rings.
- `$theme-color-primary-dark` / `-darker` / `-light` / `-lighter` — tonal variants for hover, visited, disabled.
- `$theme-color-secondary` — secondary accent for alerts, call-outs.
- `$theme-color-accent-cool` / `-warm` — accent variants (cyan/orange families by default).

USWDS ships a complete design token color system — look up any value with the [Colors reference](https://designsystem.digital.gov/design-tokens/color/overview/).

### Typography

- `$theme-font-type-sans` / `-serif` / `-mono` — font family slots. Red Glare preloads `public-sans`, `merriweather`, `roboto-mono`, plus `source-sans-3` and `open-sans` as alternates.
- `$theme-font-role-body` / `-heading` / `-code` — which font type plays which role.
- `$theme-type-scale-*` — heading and body size scales.

### Spacing

USWDS uses a [spacing scale](https://designsystem.digital.gov/design-tokens/spacing-units/) (`1` through `15`) that maps to `rem` values. Adjust the scale or individual units via `$theme-spacing-*` overrides.

## Fonts

Red Glare preloads five variable fonts from [Fontsource](https://fontsource.org):

| Package | Default role |
| --- | --- |
| `@fontsource-variable/public-sans` | Default sans serif (USWDS default) |
| `@fontsource-variable/merriweather` | Default serif |
| `@fontsource-variable/roboto-mono` | Default monospace |
| `@fontsource-variable/source-sans-3` | Alternate sans |
| `@fontsource-variable/open-sans` | Alternate sans |

To use a different font, add the corresponding `@fontsource(-variable)?/<name>` package to your project's dependencies, import it in your `uswds-settings.scss` or a companion stylesheet, and set the matching USWDS token.

## What you can't change (yet)

- **Dark mode** is out of scope for v1 — USWDS doesn't ship a canonical dark palette yet. The syntax highlighter already switches between GitHub Light and Dark at the OS level, but the rest of the chrome is light-mode only.
- **Right-to-left languages** require additional CSS work that the integration doesn't abstract. File a feature request if you need it.

## Working with custom CSS

For site-specific CSS that isn't theming — e.g. styling an authored HTML block, customizing an embed — create a regular CSS file and import it in a layout override. The integration doesn't hook site-wide custom CSS into the build today; that's on the roadmap.

## Next

:::link-button{href="/styling/css-architecture/" variant="outline"}
How classes are organized
:::
