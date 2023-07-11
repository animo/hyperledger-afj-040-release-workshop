import { KeyType, TypedArrayEncoder } from "@aries-framework/core"
import { Issuer } from "../issuer"
import { underscore, yellow } from "../utils"
import { log } from "../utils/log"

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

  await log(
    `Created did '${underscore(indyDid)}' for ${yellow(issuer.config.label)}`
  )

  return indyDid
}
