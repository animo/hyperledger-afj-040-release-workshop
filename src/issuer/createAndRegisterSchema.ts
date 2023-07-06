import { Issuer } from "./agent"

export const createAndRegisterSchema = async (issuer: Issuer, did: string) => {
  const schemaResult = await issuer.modules.anoncreds.registerSchema({
    schema: {
      attrNames: ["a"],
      issuerId: did,
      name: `Example credential`,
      version: `1.0.${Math.floor(Math.random() * 100)}`,
    },
    options: {},
  })

  if (schemaResult.schemaState.state === "failed") {
    throw new Error(`Error creating schema: ${schemaResult.schemaState.reason}`)
  }

  return schemaResult.schemaState.schemaId!
}
