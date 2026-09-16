import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import initialDataSeed from "../migration-scripts/initial-data-seed"

/**
 * Idempotent wrapper around the official DTC catalog seed. `db:migrate`
 * may already have run `migration-scripts/initial-data-seed`; skip if a
 * region exists so execOnce retries stay safe.
 */
export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionModuleService = container.resolve(Modules.REGION)
  const existingRegions = await regionModuleService.listRegions({})

  if (existingRegions.length > 0) {
    logger.info("Seed data already present, skipping.")
    return
  }

  await initialDataSeed({ container })
}
