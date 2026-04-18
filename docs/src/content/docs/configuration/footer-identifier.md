---
title: Footer & identifier
description: USWDS footer and the required federal identifier strip.
sidebar:
  order: 4
---

Federal sites have two distinct regions below the main content: the **footer** (links, contact, social) and the **identifier** (agency logo, parent agency, required compliance links). USWDS specifies both. Red Glare exposes them as independent config blocks.

## Footer (`footer`)

**Type:** `{ links?, contact?, social? }` · **Optional**

All three sub-fields are optional. Omitting `footer` entirely renders no footer. Omitting individual sub-fields renders only the populated ones.

```js
redGlare({
  footer: {
    links: [
      { label: 'Getting Started', href: '/getting-started/installation/' },
      { label: 'Components', href: '/components/alert/' },
      { label: 'Contact', href: '/contact/' },
    ],
    contact: {
      heading: 'Agency Help Desk',
      phone: '(800) 555-1234',
      email: 'help@agency.gov',
    },
    social: [
      { platform: 'github', href: 'https://github.com/example' },
      { platform: 'rss', href: '/feed.xml' },
    ],
  },
})
```

### `footer.links`

Array of `{ label, href }`. Rendered as USWDS footer primary link columns.

### `footer.contact`

- `heading?` — section heading (e.g. "Agency Help Desk").
- `phone?` — `tel:` link is wrapped automatically.
- `email?` — `mailto:` link is wrapped automatically.

### `footer.social`

Each entry is `{ platform, href }`. Supported platforms:

`facebook` · `x` · `youtube` · `instagram` · `linkedin` · `github` · `rss`

Icons are rendered from USWDS's built-in social icon sprites.

## Identifier (`identifier`)

**Type:** `{ agency, agencyLogo?, agencyHref?, parentAgency?, links }` · **Optional**

The USWDS identifier is the dark strip at the very bottom of federal sites. It's required for official .gov sites and carries the agency attribution plus mandatory compliance links (accessibility, FOIA, privacy, usa.gov).

```js
redGlare({
  identifier: {
    agency: 'Example Agency',
    agencyLogo: '/agency-seal.svg',
    agencyHref: 'https://example.gov',
    parentAgency: {
      name: 'U.S. Department of Examples',
      href: 'https://example.gov',
    },
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Accessibility', href: '/accessibility/' },
      { label: 'FOIA Requests', href: '/foia/' },
      { label: 'Privacy Policy', href: '/privacy/' },
      { label: 'No FEAR Act data', href: '/no-fear-act/' },
      { label: 'USA.gov', href: 'https://www.usa.gov/' },
    ],
  },
})
```

### Fields

- **`agency`** (required) — display name of the owning agency.
- **`agencyLogo`** — optional logo path; resolved from `public/`. Rendered only when provided.
- **`agencyHref`** — when set, wraps the logo in an anchor. Omit for an unlinked logo.
- **`parentAgency`** — `{ name, href }`. Appears alongside the primary agency.
- **`links`** (required, but may be empty) — required federal links. Follow USWDS guidance: at minimum include **About**, **Accessibility**, **FOIA**, **Privacy Policy**, **USA.gov**.

::alert{type="warning"}
  #heading
  ### Compliance reminder

  #body
  The USWDS identifier exists to meet federal disclosure requirements. If you operate a `.gov` site, keep the required compliance links even if this is an internal tool — users expect them and accessibility reviewers will flag their absence.
::

## Rendering order

From top to bottom, the page ends with:

1. Main content
2. `<footer class="usa-footer">` (from `footer`)
3. `<section class="usa-identifier">` (from `identifier`)

Both sections are wrapped by `BaseLayout.astro` — you don't render them directly.
