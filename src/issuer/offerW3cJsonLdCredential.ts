import { DidKey, JsonCredential } from "@aries-framework/core"
import { Issuer } from "./agent"

export const offerW3cJsonLdCredential = async (
  agent: Issuer,
  connectionId: string,
  issuerDid: DidKey,
  subjectDid: DidKey
) => {
  const credential: JsonCredential = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    issuer: {
      id: issuerDid.did,
    },
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: subjectDid.did,
    },
  }

  return await agent.credentials.offerCredential({
    connectionId,
    protocolVersion: "v2",
    credentialFormats: {
      jsonld: {
        credential,
        options: {
          proofType: "Ed25519Signature2018",
          proofPurpose: "assertionMethod",
        },
      },
    },
  })
}
