import {
  ClaimFormat,
  DidJwk,
  JsonTransformer,
  JwaSignatureAlgorithm,
  JwsService,
  KeyType,
  TypedArrayEncoder,
  W3cCredential,
  W3cJwtCredentialService,
  getJwkFromKey,
} from "@aries-framework/core"
import { indySdkholder } from "./holder/agent"
import { sharedComponentsIssuer } from "./issuer/agent"
import { returnWhenConnected } from "./utils"
import { exit } from "process"
import { createDidJwk } from "./issuer/createDid"
import { createW3cJwtCredential } from "./issuer/createCredential"

const Ed256DidJwkJwtVcUnsigned = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: ["VerifiableCredential"],
  issuer: {
    id: "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwieCI6InpRT293SUMxZ1dKdGRkZEI1R0F0NGxhdTZMdDhJaHk3NzFpQWZhbS0xcGMiLCJ5IjoiY2pEXzdvM2dkUTF2Z2lReTNfc01HczdXcndDTVU5RlFZaW1BM0h4bk1sdyJ9",
    name: "me",
  },
  name: "some cred",
  description: "haha",
  issuanceDate: new Date().toISOString(),
  credentialSubject: {
    id: "did:key:z6MkqgkLrRyLg6bqk27djwbbaQWgaSYgFVCKq9YKxZbNkpVv",
  },
}

void (async () => {
  // Initialize the old holder agent
  await indySdkholder.initialize()

  // Initialize the issuer
  await sharedComponentsIssuer.initialize()

  // const { outOfBandInvitation, id: outOfBandRecordId } =
  //   await sharedComponentsIssuer.oob.createInvitation()

  // const listener = returnWhenConnected(
  //   sharedComponentsIssuer,
  //   outOfBandRecordId
  // )

  // await indySdkholder.oob.receiveInvitation(outOfBandInvitation)

  //const connectionId = await listener

  //console.log(connectionId)
  console.log("===============================")

  // ============
  const subjectDid = "did:example:123"
  const issuerDid = await createDidJwk(sharedComponentsIssuer)
  const w3cVcJwt = await createW3cJwtCredential(
    sharedComponentsIssuer,
    issuerDid,
    subjectDid
  )

  console.log(w3cVcJwt)

  exit(0)

  // ==================
})()
