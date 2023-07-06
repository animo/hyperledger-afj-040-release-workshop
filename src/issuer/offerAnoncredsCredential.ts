import { Issuer } from "./agent"

export const offerAnoncredsCredential = async (
  issuer: Issuer,
  connectionId: string,
  credentialDefinitionId: string
) => {
  await issuer.credentials.offerCredential({
    protocolVersion: "v2",
    connectionId,
    credentialFormats: {
      anoncreds: {
        credentialDefinitionId,
        attributes: [{ name: "a", value: "b" }],
      },
    },
  })
}
