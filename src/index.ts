import {
  cleanUpDb,
  returnWhenCredentialInWallet,
  returnWhenProofShared,
} from "./utils"

import {
  createAndRegisterCredentialDefinintion,
  createAndRegisterDidIndy,
  createAndRegisterSchema,
  createConnection,
  createLinkSecret,
  offerAnoncredsCredential,
  migrate,
  requestAnoncredsProof,
} from "./functions"

import { indySdkHolder, sharedComponentsHolder } from "./holder"
import { issuer } from "./issuer"
import { verifier } from "./verifier"
import { exit } from "process"

cleanUpDb(sharedComponentsHolder)

void (async () => {
  await indySdkHolder.initialize()

  await createLinkSecret(indySdkHolder)

  await issuer.initialize()

  const connectionId = await createConnection(issuer, indySdkHolder)

  const issuerDid = await createAndRegisterDidIndy(issuer)

  const schemaId = await createAndRegisterSchema(issuer, issuerDid)

  const credentialDefinitionId = await createAndRegisterCredentialDefinintion(
    issuer,
    issuerDid,
    schemaId
  )

  await offerAnoncredsCredential(issuer, connectionId, credentialDefinitionId)

  await returnWhenCredentialInWallet(indySdkHolder)

  await indySdkHolder.shutdown()

  await migrate(indySdkHolder, sharedComponentsHolder)

  await sharedComponentsHolder.initialize()

  await verifier.initialize()

  const cid = await createConnection(verifier, sharedComponentsHolder)

  await requestAnoncredsProof(verifier, cid)

  const proof = await returnWhenProofShared(sharedComponentsHolder)

  console.log(proof)

  exit(0)
})()
