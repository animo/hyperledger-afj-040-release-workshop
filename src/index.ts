import { indySdkHolder, sharedComponentsHolder } from "./holder/agent"
import { issuer } from "./issuer/agent"
import { exit } from "process"
import { createConnection } from "./createConnection"
import { returnWhenCredentialInWallet } from "./utils/returnWhenCredentialInWallet"
import { migrate } from "./issuer/migrate"
import { cleanUpUtil } from "./utils/cleanUpDb"
import { createAndRegisterDidIndy } from "./issuer/createAndRegisterDidIndy"
import { offerAnoncredsCredential } from "./issuer/offerAnoncredsCredential"
import { createAndRegisterSchema } from "./issuer/createAndRegisterSchema"
import { createAndRegisterCredentialDefinintion } from "./issuer/createAndRegisterCredentialDefinition"
import { createLinkSecret } from "./issuer/createLinkSecret"
import { sharedComponentsVerifier } from "./verifier/agent"
import { returnWhenProofShared } from "./utils/returnWhenProofShared"

void (async () => {
  cleanUpUtil(sharedComponentsHolder)

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

  await sharedComponentsVerifier.initialize()

  const cid = await createConnection(
    sharedComponentsVerifier,
    sharedComponentsHolder
  )

  await sharedComponentsVerifier.proofs.requestProof({
    connectionId: cid,
    protocolVersion: "v2",
    proofFormats: {
      anoncreds: {
        requested_attributes: { group: { name: "a" } },
        name: "My First Proof Request",
        version: "1",
      },
    },
  })

  const proof = await returnWhenProofShared(sharedComponentsHolder)

  console.log(proof)

  exit(0)
})()
