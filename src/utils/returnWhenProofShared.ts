import {
  Agent,
  ProofEventTypes,
  ProofExchangeRecord,
  ProofState,
  ProofStateChangedEvent,
} from "@aries-framework/core"

export const returnWhenProofShared = (
  agent: Agent
): Promise<ProofExchangeRecord> => {
  return new Promise((resolve) => {
    agent.events.on<ProofStateChangedEvent>(
      ProofEventTypes.ProofStateChanged,
      ({ payload }) => {
        if (payload.proofRecord.state === ProofState.Done)
          resolve(payload.proofRecord)
      }
    )
  })
}
