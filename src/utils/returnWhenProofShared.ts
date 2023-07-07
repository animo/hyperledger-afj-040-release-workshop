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
      ({ payload }) => {
        if (payload.proofRecord.state === ProofState.Done) {
          log(
            `Presented ${underscore("Anoncreds")} proof for ${yellow(
              agent.config.label
            )}`,
            false
          )
          resolve(payload.proofRecord)
        }
      }
    )
  })
}
