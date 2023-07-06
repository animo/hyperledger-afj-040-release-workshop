import {
  Agent,
  CredentialEventTypes,
  CredentialExchangeRecord,
  CredentialState,
  CredentialStateChangedEvent,
} from "@aries-framework/core"

export const returnWhenCredentialInWallet = (
  agent: Agent
): Promise<CredentialExchangeRecord> => {
  return new Promise((resolve) => {
    agent.events.on<CredentialStateChangedEvent>(
      CredentialEventTypes.CredentialStateChanged,
      ({ payload }) => {
        if (payload.credentialRecord.state === CredentialState.Done)
          resolve(payload.credentialRecord)
      }
    )
  })
}
