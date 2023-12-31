import { cyan, underscore } from "../utils"
import { log } from "../utils/log"
import { Verifier } from "../verifier"

export const requestAnoncredsProof = async (
  verifier: Verifier,
  connectionId: string
) => {
  await verifier.proofs.requestProof({
    connectionId,
    protocolVersion: "v2",
    proofFormats: {
      anoncreds: {
        requested_attributes: {
          identity: { names: ["name", "date of birth", "occupation"] },
        },
        name: "Signup",
        version: "2",
      },
    },
  })

  log(
    `Requested ${underscore("Anoncreds")} proof: ${cyan(
      verifier.config.label
    )} -> ${underscore(connectionId)}`,
    false
  )
}
