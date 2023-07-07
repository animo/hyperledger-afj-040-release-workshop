import { Agent, DidKey, KeyDidCreateOptions } from "@aries-framework/core"
import { agentDependencies } from "@aries-framework/node"
import { OpenId4VcClientModule } from "@aries-framework/openid4vc-client"

void (async (qrCodeData: string) => {
  const agent = new Agent({
    config: { label: "openid4vc-client" },
    modules: { openid4vc: new OpenId4VcClientModule() },
    dependencies: agentDependencies,
  })

  await agent.initialize()

  agent.modules.openid4vc.requestCredentialUsingPreAuthorizedCode({
    issuerUri: qrCodeData,
    verifyCredentialStatus: false,
    proofOfPossessionVerificationMethodResolver: async ({
      supportedDidMethods,
      keyType,
    }) => {
      const didMethod = supportedDidMethods.includes("did:key")
        ? "key"
        : undefined

      if (!didMethod) {
        throw new Error(
          `No supported did method could be found. Supported methods are did:key. Issuer supports ${supportedDidMethods.join(
            ", "
          )}`
        )
      }

      const didResult = await agent.dids.create<KeyDidCreateOptions>({
        method: didMethod,
        options: {
          keyType,
        },
      })

      if (didResult.didState.state !== "finished") {
        throw new Error("DID creation failed.")
      }

      const didKey = DidKey.fromDid(didResult.didState.did)
      const verificationMethodId = `${didKey.did}#${didKey.key.fingerprint}`

      return didResult.didState.didDocument.dereferenceKey(verificationMethodId)
    },
  })
})("qrCode")
