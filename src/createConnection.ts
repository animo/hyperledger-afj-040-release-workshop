import { Agent } from "@aries-framework/core"
import { returnWhenConnected } from "./utils"

export const createConnection = async (issuer: Agent, holder: Agent) => {
  const outOfBandRecord = await issuer.oob.createInvitation()

  await holder.oob.receiveInvitation(outOfBandRecord.outOfBandInvitation)

  return await returnWhenConnected(issuer, outOfBandRecord.id)
}
