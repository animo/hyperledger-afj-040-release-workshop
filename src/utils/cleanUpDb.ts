import { Agent } from "@aries-framework/core"
import { rmSync } from "fs"
import { homedir } from "os"

export const cleanUpDb = (agent: Agent) => {
  try {
    rmSync(`${homedir()}/.afj/data/wallet/${agent.config.walletConfig?.id}`, {
      force: true,
      recursive: true,
    })
  } catch (e) {}
}
