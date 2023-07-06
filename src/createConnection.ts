import { Agent } from "@aries-framework/core"
import { returnWhenConnected } from "./utils"

export const createConnection = async (sender: Agent, recipient: Agent) => {
  const outOfBandRecord = await sender.oob.createInvitation()

  const {
    outOfBandRecord: { id },
  } = await recipient.oob.receiveInvitation(outOfBandRecord.outOfBandInvitation)

  const hrwc = returnWhenConnected(recipient, id)
  const irwc = returnWhenConnected(sender, outOfBandRecord.id)

  const [, connectionId] = await Promise.all([hrwc, irwc])

  return connectionId
}
