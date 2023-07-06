import {
  Agent,
  ClaimFormat,
  DidJwk,
  JsonTransformer,
  W3cCredential,
} from "@aries-framework/core"
import { W3cJsonLdCredentialService } from "@aries-framework/core/build/modules/vc/data-integrity/W3cJsonLdCredentialService"

export const credential = (issuerDid: string, subjectDid: string) => ({
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: ["VerifiableCredential"],
  issuer: {
    id: issuerDid,
  },
  issuanceDate: new Date().toISOString(),
  credentialSubject: {
    id: subjectDid,
  },
})

export const createW3cJsonLdCredential = async (
  agent: Agent,
  issuerDid: DidJwk,
  subjectDid: DidJwk
) => {
  const w3cJsonLdCredentialService = agent.dependencyManager.resolve(
    W3cJsonLdCredentialService
  )

  const cred = credential(issuerDid.did, subjectDid.did)

  const w3cCredential = JsonTransformer.fromJSON(cred, W3cCredential)

  return await w3cJsonLdCredentialService.signCredential(agent.context, {
    format: ClaimFormat.LdpVc,
    proofType: "Ed25519Signature2018",
    verificationMethod: issuerDid.verificationMethodId,
    credential: w3cCredential,
  })
}
