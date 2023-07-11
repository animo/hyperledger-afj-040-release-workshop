import { Issuer } from "../issuer"
import { cyan, underscore } from "../utils"
import { log } from "../utils/log"

export const offerAnoncredsCredential = async (
  issuer: Issuer,
  connectionId: string,
  credentialDefinitionId: string
) => {
  const dob = new Date()
  dob.setFullYear(new Date().getFullYear() - 25)

  await issuer.credentials.offerCredential({
    protocolVersion: "v2",
    connectionId,
    credentialFormats: {
      anoncreds: {
        credentialDefinitionId,
        attributes: [
          { name: "name", value: "John Doe" },
          {
            name: "date of birth",
            value: dob.toISOString(),
          },
          { name: "email", value: "jane@anoncreds.ltd" },
          { name: "occupation", value: "Credential Influencer" },
        ],
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
