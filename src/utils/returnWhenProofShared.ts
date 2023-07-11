import {
  Agent,
  ProofEventTypes,
  ProofExchangeRecord,
  ProofState,
  ProofStateChangedEvent,
} from "@aries-framework/core"
import { underscore, yellow } from "./colors"
import { log } from "./log"

export const returnWhenProofShared = (
  agent: Agent
): Promise<ProofExchangeRecord> => {
  return new Promise((resolve) => {
    agent.events.on<ProofStateChangedEvent>(
      ProofEventTypes.ProofStateChanged,
      async ({ payload }) => {
        if (payload.proofRecord.state === ProofState.Done) {
          log(
            `Presented ${underscore("Anoncreds")} proof for ${yellow(
              agent.config.label
            )}`,
            false
          )

          log("============= Presentation ==============")
          const formattedData = await agent.proofs.getFormatData(
            payload.proofRecord.id
          )
          const items = Object.entries(
            // @ts-ignore
            formattedData.presentation?.anoncreds.requested_proof
              .revealed_attr_groups.identity.values
          )

          // @ts-ignore
          items.forEach(([key, { raw }]) => {
            log(`- ${key}: ${raw}`, false)
          })

          log("=========================================")
          resolve(payload.proofRecord)
        }
      }
    )
  })
}
