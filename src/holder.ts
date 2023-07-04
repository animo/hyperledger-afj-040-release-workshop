import { IndySdkToAskarMigrationUpdater } from "@aries-framework/indy-sdk-to-askar-migration"
import { indySdkholder, sharedComponentsHolder } from "./holder/agent"
import { homedir } from "os"
import { rmSync } from "fs"
import { exit } from "process"

const cleanUtil = () => {
  try {
    rmSync(
      `${homedir()}/.afj/data/wallet/${
        sharedComponentsHolder.config.walletConfig?.id
      }`,
      { force: true, recursive: true }
    )
  } catch (e) {}
}

export const main = async () => {
  cleanUtil()
  const indySdkDbPath = `${homedir()}/.indy_client/wallet/${
    indySdkholder.config.walletConfig?.id
  }/sqlite.db`

  await indySdkholder.initialize()
  const { id } = await indySdkholder.genericRecords.save({
    content: { foo: "bar" },
  })

  await indySdkholder.shutdown()

  const updater = await IndySdkToAskarMigrationUpdater.initialize({
    dbPath: indySdkDbPath,
    agent: sharedComponentsHolder,
  })

  await updater.update()

  await sharedComponentsHolder.initialize()
  const record = await sharedComponentsHolder.genericRecords.findById(id)

  console.log(record?.content)

  await sharedComponentsHolder.shutdown()

  exit(0)
}

void main()
