import { Agent, DidJwk, KeyType, getJwkFromKey } from "@aries-framework/core"

export const createDidJwk = async (agent: Agent) => {
  const key = await agent.wallet.createKey({
    keyType: KeyType.P256,
  })

  const jwk = getJwkFromKey(key)

  const didJwk = DidJwk.fromJwk(jwk)

  await agent.dids.import(didJwk)

  return didJwk
}
