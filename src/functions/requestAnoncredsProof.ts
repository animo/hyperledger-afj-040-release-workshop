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
        requested_attributes: { group: { name: "a" } },
        name: "My First Proof Request",
        version: "1",
      },
    },
  })
}
