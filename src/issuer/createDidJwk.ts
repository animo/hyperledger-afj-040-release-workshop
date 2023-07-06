import { Agent, DidKey, KeyType } from "@aries-framework/core"

export const createDidKeyEd25519 = async (agent: Agent) => {
  const key = await agent.wallet.createKey({
    keyType: KeyType.Ed25519,
  })

  const didJwk = new DidKey(key)

  await agent.dids.import({
    did: didJwk.did,
    didDocument: didJwk.didDocument,
    overwrite: true,
  })

  return didJwk
}
