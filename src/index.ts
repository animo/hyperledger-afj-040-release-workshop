import { indySdkHolder, sharedComponentsHolder } from "./holder/agent"
import { issuer } from "./issuer/agent"
import { exit } from "process"
import { offerW3cJsonLdCredential } from "./issuer/offerW3cJsonLdCredential"
import { createDidKeyEd25519 } from "./issuer/createDidJwk"
import { createConnection } from "./createConnection"
import { returnWhenCredentialInWallet } from "./utils/returnWhenCredentialInWallet"
import { migrate } from "./issuer/migrate"
import { cleanUpUtil } from "./utils/cleanUpDb"

void (async () => {
  cleanUpUtil(sharedComponentsHolder)

  await indySdkHolder.initialize()
  await issuer.initialize()

  const connectionId = await createConnection(issuer, indySdkHolder)

  const subjectDid = await createDidKeyEd25519(indySdkHolder)
  const issuerDid = await createDidKeyEd25519(issuer)

  await offerW3cJsonLdCredential(issuer, connectionId, issuerDid, subjectDid)

  const { id: credentialId } = await returnWhenCredentialInWallet(indySdkHolder)

  await indySdkHolder.shutdown()

  await migrate(indySdkHolder, sharedComponentsHolder)

  await sharedComponentsHolder.initialize()

  const credential = await sharedComponentsHolder.credentials.getById(
    credentialId
  )

  console.log(credential)

  exit(0)
})()
