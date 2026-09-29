import {
  batchLinkProductsToCollectionWorkflow,
  createCollectionsWorkflow,
} from "@medusajs/medusa/core-flows"
import { ExecArgs, MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import initialDataSeed from "../migration-scripts/initial-data-seed"

/**
 * The official DTC home page only renders collection rails. Categories
 * and unlinked published products stay invisible there.
 */
async function ensureFeaturedCollection(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id"],
  })

  if (collections.length > 0) {
    return
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id"],
  })

  if (!products.length) {
    return
  }

  const { result: created } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        {
          title: "Latest Drops",
          handle: "latest-drops",
        },
      ],
    },
  })

  await batchLinkProductsToCollectionWorkflow(container).run({
    input: {
      id: created[0].id,
      add: products.map((product) => product.id),
    },
  })

  logger.info(
    `Linked ${products.length} products to collection ${created[0].title}`
  )
}

/**
 * Idempotent wrapper around the official DTC catalog seed. `db:migrate`
 * may already have run `migration-scripts/initial-data-seed` (which used
 * to skip collections). Always backfill a featured collection when
 * products exist without one.
 */
export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionModuleService = container.resolve(Modules.REGION)
  const existingRegions = await regionModuleService.listRegions({})

  if (existingRegions.length === 0) {
    await initialDataSeed({ container })
  } else {
    logger.info("Seed data already present; ensuring featured collection.")
  }

  await ensureFeaturedCollection(container)
}
