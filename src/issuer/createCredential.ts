import {
  Agent,
  ClaimFormat,
  DidJwk,
  JsonTransformer,
  JwaSignatureAlgorithm,
  JwsService,
  W3cCredential,
  W3cJwtCredentialService,
} from "@aries-framework/core"

const credential = (issuerDid: string, subjectDid: string) => ({
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: ["VerifiableCredential"],
  issuer: {
    id: issuerDid,
    name: "me",
  },
  name: "some cred",
  description: "haha",
  issuanceDate: new Date().toISOString(),
  credentialSubject: {
    id: subjectDid,
  },
})

export const createW3cJwtCredential = async (
  agent: Agent,
  issuerDid: DidJwk,
  subjectDid: string
) => {
  const w3cJwtCredentialService = new W3cJwtCredentialService(new JwsService())

  const cred = credential(issuerDid.did, subjectDid)

  const w3cCredential = JsonTransformer.fromJSON(cred, W3cCredential)

  const vcJwt = await w3cJwtCredentialService.signCredential(agent.context, {
    alg: JwaSignatureAlgorithm.ES256,
    format: ClaimFormat.JwtVc,
    verificationMethod: issuerDid.verificationMethodId,
    credential: w3cCredential,
  })

  return vcJwt
}
