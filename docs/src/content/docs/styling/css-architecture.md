---
title: CSS architecture
description: How Red Glare organizes its stylesheets.
sidebar:
  order: 2
---

Red Glare's CSS is a mix of USWDS primitives and a small set of component-specific styles. Understanding the class prefixes helps when you're inspecting the DOM or overriding a specific element.

## Two class prefixes

### `usa-*` — USWDS

Every class starting with `usa-` comes from USWDS. If you search for `usa-alert`, `usa-button`, `usa-accordion`, the authoritative reference is the [USWDS component docs](https://designsystem.digital.gov/components/).

These classes are **stable**. USWDS treats them as its public API.

### `rg-*` — Red Glare

Classes prefixed `rg-` are Red Glare's own additions — component-specific styling for parts USWDS doesn't cover:

- `rg-code-group`, `rg-code-group__tab`, `rg-code-group__panel`
- `rg-tabs`, `rg-tabs__tab`, `rg-tabs__panel`
- `rg-endpoint`, `rg-endpoint__method`, `rg-endpoint__path`, `rg-endpoint__grid`, `rg-endpoint__col`, `rg-endpoint__pill`
- `rg-parameters`, `rg-parameters__row`, `rg-parameters__name`, `rg-parameters__type`
- `rg-responses`

Follows the [BEM](https://getbem.com/) naming convention — `block`, `block__element`, `block--modifier`.

## Utility classes

USWDS ships [utility classes](https://designsystem.digital.gov/utilities/) for common layout and typography — spacing (`margin-top-2`, `padding-x-3`), typography (`text-bold`, `font-sans-sm`), display (`display-flex`, `display-none`), layout (`grid-row`, `grid-col-6`, `flex-align-center`).

Red Glare uses them extensively in component internals and you can use them in your authored content too:

```markdown
<div class="display-flex flex-align-center grid-gap margin-y-3">
  ...
</div>
```

## Breakpoints

USWDS defines [responsive breakpoints](https://designsystem.digital.gov/utilities/display/#prefixes-display) as utility prefixes:

| Prefix | Min width |
| --- | --- |
| (none) | 0 (mobile) |
| `mobile-lg:` | 480px |
| `tablet:` | 640px |
| `desktop:` | 1024px |
| `desktop-lg:` | 1200px |
| `widescreen:` | 1400px |

Example — a class that's `display: none` on mobile and `display: flex` on tablet and up:

```
display-none tablet:display-flex
```

## Custom properties

The layout uses a small number of CSS custom properties for site-level values (sidebar width, max content width, header height). They're defined in the layout's global stylesheet and can be overridden by writing a project-level `custom.css` imported via `head`.

Most theming work should happen in [SCSS settings](/styling/theming/) — custom properties are for runtime, JS-adjacent values.

## Font imports

Variable font files are imported in `_fonts.scss`. The integration marks the `@fontsource(-variable)?/*` packages as Vite `ssr.noExternal` so CSS flows through Vite's pipeline at build time.

The first-page request preloads the variable woff2 files via `<link rel="preload">` to mitigate flash-of-unstyled-text on cold loads. See commit `1ffb1d4` in the repo for the rationale.

## Inspecting a component

Every Red Glare component has a predictable class structure. The [Alert component](/components/alert/) source uses:

```
.usa-alert.usa-alert--info
└── .usa-alert__body
    ├── .usa-alert__heading.text-bold  (when #heading slot set)
    └── .usa-alert__text
```

Inspecting the element in devtools will always find these class names. If you need to override a style on a specific component, target the BEM element class (`usa-alert__heading`) not the block class (`usa-alert`) — it's more specific and won't bleed into modifiers.

## Don't author raw classes you can't explain

The integration's BEM classes aren't public API — they can change between minor versions of `@red-glare/astro`. If you need to override a Red Glare internal, either:

- Prefer [theming via USWDS tokens](/styling/theming/) — that's the stable customization surface.
- Fork a component if you need structural changes the token system can't express.

USWDS's `usa-*` classes are stable and safe to target directly.
