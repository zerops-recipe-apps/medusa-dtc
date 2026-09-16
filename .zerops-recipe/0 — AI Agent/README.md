# Medusa DTC — AI Agent Environment

<!-- #ZEROPS_EXTRACT_START:intro# -->
**AI agent** environment deploys the Medusa DTC backend (`medusa`) and Next.js storefront (`nextstore`) from [zerops-recipe-apps/medusa-dtc](https://github.com/zerops-recipe-apps/medusa-dtc) with hobby PostgreSQL, Valkey, and public-read object storage. Both apps use their production setups — the recipe has no idle `setup: dev` — so an agent can hit `/health` and `/app` immediately after import.
<!-- #ZEROPS_EXTRACT_END:intro# -->
