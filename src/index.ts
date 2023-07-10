import {
  cleanUpDb,
  cyan,
  returnWhenCredentialInWallet,
  returnWhenProofShared,
  yellow,
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
import { log } from "./utils/log"

cleanUpDb(sharedComponentsHolder)

void (async () => {
  await log("Hyperledger AFJ v0.4.0 Demo")

  await log(`Initializing ${cyan(indySdkHolder.config.label)}...`)
  await indySdkHolder.initialize()

  await createLinkSecret(indySdkHolder)

  await log(`Initializing ${yellow(issuer.config.label)}...`)
  await issuer.initialize()

  const issuerDid = await createAndRegisterDidIndy(issuer)

  const schemaId = await createAndRegisterSchema(issuer, issuerDid)

  const credentialDefinitionId = await createAndRegisterCredentialDefinintion(
    issuer,
    issuerDid,
    schemaId
  )

  const connectionId = await createConnection(issuer, indySdkHolder)

  await offerAnoncredsCredential(issuer, connectionId, credentialDefinitionId)

  await returnWhenCredentialInWallet(indySdkHolder)

  await log(`Shutting down ${yellow(indySdkHolder.config.label)}...`)
  await indySdkHolder.shutdown()

  await migrate(indySdkHolder, sharedComponentsHolder)

  await log(
    `Initializing ${cyan(
      sharedComponentsHolder.config.label
    )} (with shared components)...`
  )
  await sharedComponentsHolder.initialize()

  await log(`Initializing ${yellow(verifier.config.label)}...`)
  await verifier.initialize()

  const cid = await createConnection(verifier, sharedComponentsHolder)

  await requestAnoncredsProof(verifier, cid)

  await returnWhenProofShared(sharedComponentsHolder)

  exit(0)
})()
