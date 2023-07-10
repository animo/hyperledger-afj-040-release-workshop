import { Agent } from "@aries-framework/core"
import { cyan, returnWhenConnected, underscore, yellow } from "../utils"
import { log } from "../utils/log"

export const createConnection = async (sender: Agent, recipient: Agent) => {
  const outOfBandRecord = await sender.oob.createInvitation()

  const {
    outOfBandRecord: { id },
  } = await recipient.oob.receiveInvitation(outOfBandRecord.outOfBandInvitation)

  const hrwc = returnWhenConnected(recipient, id)
  const irwc = returnWhenConnected(sender, outOfBandRecord.id)
  const [, connectionId] = await Promise.all([hrwc, irwc])

  await log(
    `Established a ${underscore("connection")}: ${cyan(
      sender.config.label
    )} <-> ${yellow(recipient.config.label)}`
  )

  return connectionId
}
