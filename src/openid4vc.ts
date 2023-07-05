import { Agent, InitConfig, LogLevel } from "@aries-framework/core"
import { agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"

import { ariesAskar } from "@hyperledger/aries-askar-nodejs"

import { NamedConsoleLogger } from "./utils"
import { OpenId4VcClientModule } from "@aries-framework/openid4vc-client"

const name = "openid4vc-holder"
const config: InitConfig = {
  label: name,
  logger: new NamedConsoleLogger(LogLevel.trace, name, "green"),
  walletConfig: {
    id: "hyperledger-afj-040-release-workshop-openid4vc-holder",
    key: "insecure-secret",
  },
}

const modules = {
  askar: new AskarModule({ ariesAskar }),
  openid4vc: new OpenId4VcClientModule(),
}

type SharedComponentsModules = typeof modules
export const openid4vcHolder = new Agent<SharedComponentsModules>({
  config,
  modules,
  dependencies: agentDependencies,
})

void (async () => {
  await openid4vcHolder.initialize()

  const qrCodeData = "..."

  const credential =
    await openid4vcHolder.modules.openid4vc.requestCredentialUsingPreAuthorizedCode(
      {
        issuerUri: qrCodeData,
        verifyCredentialStatus: true,
        // TODO: proper implementation
        proofOfPossessionVerificationMethodResolver: () => ({
          id: "a",
          type: "some",
          controller: "me",
        }),
      }
    )

  console.log(credential)
})()
