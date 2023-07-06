import { Issuer } from "./agent"

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

  return credentialDefinitionResult.credentialDefinitionState
    .credentialDefinitionId!
}
