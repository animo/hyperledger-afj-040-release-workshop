import { Agent } from "@aries-framework/core"
import { IndySdkToAskarMigrationUpdater } from "@aries-framework/indy-sdk-to-askar-migration"
import { homedir } from "os"

export const migrate = async (fromAgent: Agent, toAgent: Agent) => {
  const fromDbPath = `${homedir()}/.indy_client/wallet/${
    fromAgent.config.walletConfig?.id
  }/sqlite.db`

  const updater = await IndySdkToAskarMigrationUpdater.initialize({
    dbPath: fromDbPath,
    agent: toAgent,
  })

  await updater.update()
}
