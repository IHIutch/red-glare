---
title: Other static hosts
description: Deploy Red Glare to Netlify, Vercel, GitHub Pages, S3, and others.
sidebar:
  order: 2
---

A Red Glare build is a fully static site — `astro build` produces a `dist/` directory of HTML, CSS, JS, and assets. Any static host can serve it. This page covers the common options.

## Netlify

Create `netlify.toml` at the project root:

```toml [netlify.toml]
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

Connect the repo in the Netlify dashboard. The redirect rule ensures unmatched paths serve the custom 404 page.

## Vercel

Add `vercel.json`:

```json [vercel.json]
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist"
}
```

Vercel's zero-config Astro support works out of the box — just pushing to a connected repo ships the site.

## GitHub Pages

Use [actions/deploy-pages](https://github.com/actions/deploy-pages):

```yaml [.github/workflows/pages.yml]
name: Deploy to Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

If your site is served from a subpath (`https://<user>.github.io/<repo>/`), set the subpath in your Astro config:

```js [astro.config.mjs]
export default defineConfig({
  site: 'https://yourname.github.io',
  base: '/your-repo/',
  integrations: [redGlare({ title: 'My Docs' })],
})
```

## AWS S3 + CloudFront

1. `pnpm build`
2. Sync `dist/` to an S3 bucket: `aws s3 sync dist/ s3://my-bucket --delete`
3. Point a CloudFront distribution at the bucket.
4. Set the default root object to `index.html`.
5. Configure a custom error response for 403/404 → `/404.html` with response code `404`.

## Azure Static Web Apps

Create `staticwebapp.config.json`:

```json [staticwebapp.config.json]
{
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html"
    }
  }
}
```

Push to a connected repo; Static Web Apps auto-builds with the default Astro detection.

## Must-haves for any host

Whatever you pick, make sure the host:

::summary-box
  #heading
  ### Static host checklist

  #body
  - **Serves `dist/` as the document root.**
  - **Maps unmatched routes to `/404.html`** — Red Glare generates one automatically.
  - **Preserves trailing slashes** on directory-style URLs. Astro's default build produces `/page/index.html` and expects `/page/` to work; some hosts strip trailing slashes by default.
  - **Serves `.xml` and `.txt` files with correct MIME types** for RSS and `llms.txt`.
  - **Runs on HTTPS.** The government banner loses credibility on HTTP.
::

## What doesn't work

- **FTP-style uploads to shared hosting without 404 rewrites** may serve broken links as the host's default 404 page, not yours.
- **Hosts that strip query strings** might break Pagefind's search UI (it uses query strings to share result state).

If your deploy target has constraints the above doesn't cover, the [Astro deployment guides](https://docs.astro.build/en/guides/deploy/) are comprehensive — every host that works for a static Astro site works for Red Glare.
