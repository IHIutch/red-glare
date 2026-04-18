---
title: Cloudflare Workers
description: Deploy the built site to Cloudflare Workers Static Assets.
sidebar:
  order: 1
---

This docs site is deployed to Cloudflare Workers via [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — the same setup works for any Red Glare project. A Red Glare build is a static site, so the Workers deployment is a thin Worker that serves the `dist/` directory as static assets.

## `wrangler.jsonc`

Create `wrangler.jsonc` at the project root:

```jsonc [wrangler.jsonc]
{
  "$schema": "https://unpkg.com/wrangler/config-schema.json",
  "name": "my-agency-docs",
  "compatibility_date": "2026-04-17",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

### What each field does

- **`name`** — the Worker name. Becomes part of the default URL (`<name>.<subdomain>.workers.dev`) unless you bind a custom domain.
- **`compatibility_date`** — pins the Workers runtime version for reproducibility. Use the date you first created the worker; update it when you adopt new runtime features.
- **`assets.directory`** — where the built site lives. Astro writes to `./dist` by default.
- **`assets.not_found_handling`** — `"404-page"` tells Cloudflare to serve `dist/404.html` for unmatched routes. Red Glare generates a 404 page automatically, so this Just Works.

## Build and deploy

::code-group
```bash [pnpm]
pnpm build
pnpm dlx wrangler deploy
```
```bash [npm]
npm run build
npx wrangler deploy
```
```bash [yarn]
yarn build
yarn dlx wrangler deploy
```
::

The first time you run `wrangler deploy`, you'll be prompted to authenticate — the CLI opens a browser to log in via OAuth. Afterwards the session is stored locally.

On subsequent deploys, `wrangler deploy` uploads `dist/` and the worker goes live in under a minute.

## CI/CD

For automatic deploys on push, use [`cloudflare/wrangler-action`](https://github.com/cloudflare/wrangler-action) in GitHub Actions:

```yaml [.github/workflows/deploy.yml]
name: Deploy docs

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: .
```

Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets.

::alert{type="info"}
  #heading
  ### Scope the API token

  #body
  Use a scoped API token (**Workers Scripts: Edit** + **Account: Workers Routes: Edit**) rather than a global API key. Scoped tokens can't touch other services on the account if they leak.
::

## Custom domains

Bind a custom domain to the Worker via Cloudflare dashboard or wrangler:

```bash
wrangler domains add docs.example.gov
```

The domain must be on a zone in your Cloudflare account. Wrangler provisions the certificate automatically.

## What's not deployed via this route

This setup is for **static Red Glare sites** — the common case. If you're running Astro in SSR mode with Cloudflare's adapter, that's a different setup: wrangler serves a Worker that runs your Astro server on each request, and the config looks different. Red Glare's `doc`/`api`/`splash` templates are all static — you only need SSR for dynamic content (user login, personalization, etc.) that this integration doesn't target.

## Verifying the deploy

After `wrangler deploy` completes, it prints the live URL. Visit it and verify:

- The home page renders.
- The sidebar appears on a doc template page.
- `/feed.xml` returns valid XML.
- `/llms.txt` returns text.
- `/sitemap-index.xml` returns XML.
- A made-up URL like `/nope` returns the 404 page (not a plain Cloudflare error).

## Next

:::link-button{href="/deployment/static-hosts/" variant="outline"}
Other static hosts
:::
