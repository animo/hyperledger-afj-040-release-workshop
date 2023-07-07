import { Issuer } from "../issuer"
import { underscore, yellow } from "../utils"
import { log } from "../utils/log"

export const createAndRegisterCredentialDefinintion = async (
  issuer: Issuer,
  issuerDid: string,
  schemaId: string
) => {
  const credentialDefinitionResult =
    await issuer.modules.anoncreds.registerCredentialDefinition({
      credentialDefinition: {
        tag: "default",
        issuerId: issuerDid,
        schemaId,
      },
      options: {},
    })

  if (credentialDefinitionResult.credentialDefinitionState.state === "failed") {
    throw new Error(
      `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
    )
  }

  await log(
    `Created ${underscore("credential definition")} with id '${underscore(
      credentialDefinitionResult.credentialDefinitionState
        .credentialDefinitionId!
    )}' for ${yellow(issuer.config.label)}`
  )

  return credentialDefinitionResult.credentialDefinitionState
    .credentialDefinitionId!
}
