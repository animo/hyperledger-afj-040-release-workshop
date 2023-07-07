import {
  Agent,
  CredentialEventTypes,
  CredentialExchangeRecord,
  CredentialState,
  CredentialStateChangedEvent,
} from "@aries-framework/core"
import { underscore, yellow } from "./colors"
import { log } from "./log"

export const returnWhenCredentialInWallet = (
  agent: Agent
): Promise<CredentialExchangeRecord> => {
  return new Promise((resolve) => {
    agent.events.on<CredentialStateChangedEvent>(
      CredentialEventTypes.CredentialStateChanged,
      async ({ payload }) => {
        if (payload.credentialRecord.state === CredentialState.Done) {
          await log(
            `Accepted ${underscore("Anoncreds")} credential for ${yellow(
              agent.config.label
            )}`
          )
          resolve(payload.credentialRecord)
        }
      }
    )
  })
}
