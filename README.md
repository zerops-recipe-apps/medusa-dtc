# Medusa DTC Recipe App

<!-- #ZEROPS_EXTRACT_START:intro# -->
[Medusa](https://medusajs.com) v2.21 direct-to-consumer API and admin at the repository root — retail catalog, cart, and checkout without B2B company modules. Pairs with [medusa-dtc-frontend](https://github.com/zerops-recipe-apps/medusa-dtc-frontend). Deploy with PostgreSQL, Valkey, Meilisearch, and MinIO via the [Medusa DTC recipe](https://app.zerops.io/recipes/medusa-dtc) on [Zerops](https://zerops.io).
<!-- #ZEROPS_EXTRACT_END:intro# -->

Used within [Medusa DTC recipe](https://app.zerops.io/recipes/medusa-dtc) for the Zerops platform.

⬇️ **Full recipe page and deploy with one-click**

[![Deploy on Zerops](https://github.com/zeropsio/recipe-shared-assets/blob/main/deploy-button/light/deploy-button.svg)](https://app.zerops.io/recipes/medusa-dtc?environment=small-production)

![cover](https://github.com/zeropsio/recipe-shared-assets/blob/main/covers/svg/cover-nextjs.svg)

## Repositories

| Repo | Role |
| --- | --- |
| [medusa-dtc](https://github.com/zerops-recipe-apps/medusa-dtc) (this repo) | Medusa backend + admin (`/app`) |
| [medusa-dtc-frontend](https://github.com/zerops-recipe-apps/medusa-dtc-frontend) | Optional Next.js 15 DTC storefront |

Skip `nextstore*` services in the recipe import for backend-only projects. Storefront Zerops services keep the `nextstore` hostname; the Git repository is `medusa-dtc-frontend`.

Recipe imports: [`zeropsio/recipes/medusa-dtc`](https://github.com/zeropsio/recipes/tree/main/medusa-dtc) and [`.zerops-recipe/`](.zerops-recipe/).

## Local development

```bash
yarn install
cp .env.template .env
yarn dev                # http://localhost:9000 — admin at /app
```

Optional storefront:

```bash
cd ../medusa-dtc-frontend
cp .env.template .env.local
yarn install && yarn dev   # http://localhost:8000
```

## Integration Guide

<!-- #ZEROPS_EXTRACT_START:integration-guide# -->

### 1. Adding `zerops.yml`

Same layout as [medusa-b2b](https://github.com/zerops-recipe-apps/medusa-b2b): Medusa at repo root, `prod` ships `.medusa/server`, `dev` uses `deployFiles: ./` for SSH workspaces.

```yaml
zerops:
  - setup: prod
    build:
      base: nodejs@24
      buildCommands:
        - yarn
        - yarn build
        - cp -f package.json tsconfig.json .medusa/server/
      deployFiles:
        - .medusa/server/~
        - ~node_modules
    run:
      initCommands:
        - zsc execOnce ${appVersionId}_migration -- yarn migrate
        - zsc execOnce ${appVersionId}_links -- yarn syncLinks
        - zsc execOnce createInitialSuperadmin_v2 -- yarn createInitialSuperadmin
        - zsc execOnce seedInitialData_v2 -- yarn seedInitialData_v2
        - yarn setInitialPublishableKey
        - yarn reloadNextstoreEnv
        - zsc execOnce addInitialSearchDocuments -- yarn addInitialSearchDocuments
      ports:
        - port: 9000
          httpSupport: true
      start: yarn start

  - setup: dev
    build:
      base: nodejs@24
      deployFiles: ./
      buildCommands:
        - yarn
```

Project **vault** holds Stripe and SMTP secrets; `zerops.yml` only maps service hostnames and computed URLs. No Turbo/Nx — Yarn 1 at the root.

<!-- #ZEROPS_EXTRACT_END:integration-guide# -->
