import { Agent } from "@aries-framework/core"
import { IndySdkToAskarMigrationUpdater } from "@aries-framework/indy-sdk-to-askar-migration"
import { homedir } from "os"
import { cyan, underscore } from "../utils"
import { log } from "../utils/log"

export const migrate = async (fromAgent: Agent, toAgent: Agent) => {
  const fromDbPath = `${homedir()}/.indy_client/wallet/${
    fromAgent.config.walletConfig?.id
  }/sqlite.db`

  const updater = await IndySdkToAskarMigrationUpdater.initialize({
    dbPath: fromDbPath,
    agent: toAgent,
  })

  await updater.update()
  await log(
    `Migrated ${cyan(fromAgent.config.label)} with the ${underscore(
      "indy-sdk"
    )} to the new ${underscore("shared components")}`
  )
}
