# Medusa DTC (backend)

<!-- #ZEROPS_EXTRACT_START:intro# -->
Medusa v2.21 DTC backend and admin on [Zerops](https://zerops.io). Storefront: [medusa-dtc-nextstore](https://github.com/zerops-recipe-apps/medusa-dtc-nextstore). PostgreSQL, Valkey, Meilisearch, MinIO, Mailpit on dev envs. Omit nextstore services for backend-only.
<!-- #ZEROPS_EXTRACT_END:intro# -->

## Repos

| Repo | Role |
| --- | --- |
| **This repo** | Medusa API + admin (`zerops.yml` → `dev` / `prod`) |
| [medusa-dtc-nextstore](https://github.com/zerops-recipe-apps/medusa-dtc-nextstore) | Next.js 15 DTC storefront |

[`nextstore/`](nextstore/) is for **local dev** only. Zerops deploys the standalone nextstore repo.

Imports: [`.zerops-recipe/`](.zerops-recipe/) and [`zeropsio/recipes/medusa-dtc`](https://github.com/zeropsio/recipes/tree/main/medusa-dtc).

## Local dev

```bash
cd backend && yarn dev
cd nextstore && yarn dev
```
