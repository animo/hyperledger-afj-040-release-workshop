import { Issuer } from "../issuer"
import { cyan, underscore } from "../utils"
import { log } from "../utils/log"

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

  log(
    `Offered ${underscore("Anoncreds")} credential: ${cyan(
      issuer.config.label
    )} -> ${underscore(connectionId)}`,
    false
  )
}