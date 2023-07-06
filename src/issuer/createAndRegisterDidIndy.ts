import { KeyType, TypedArrayEncoder } from "@aries-framework/core"
import { Issuer } from "./agent"

export const createAndRegisterDidIndy = async (issuer: Issuer) => {
  const seed = TypedArrayEncoder.fromString(`someseed000000000000000000000000`)
  const unqualifiedIndyDid = `DactDhayXfcvT599yNzBjr`
  const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`

  await issuer.dids.import({
    did: indyDid,
    overwrite: true,
    privateKeys: [
      {
        privateKey: seed,
        keyType: KeyType.Ed25519,
      },
    ],
  })

  return indyDid
}
