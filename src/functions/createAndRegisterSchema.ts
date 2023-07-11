import { Issuer } from "../issuer"
import { underscore, yellow } from "../utils"
import { log } from "../utils/log"

export const createAndRegisterSchema = async (issuer: Issuer, did: string) => {
  const schemaResult = await issuer.modules.anoncreds.registerSchema({
    schema: {
      attrNames: ["name", "date of birth", "email", "occupation"],
      issuerId: did,
      name: `Anonymous Credentials Ltd. Employee`,
      version: `1.0.${Math.floor(Math.random() * 1000)}`,
    },
    options: {},
  })

  if (schemaResult.schemaState.state === "failed") {
    throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`)
  }

  await log(
    `Created ${underscore("schema")} with id '${underscore(
      schemaResult.schemaState.schemaId!
    )}' for ${yellow(issuer.config.label)}`
  )

  return schemaResult.schemaState.schemaId!
}
