import { Holder } from "../holder/agent"

export const createLinkSecret = async (holder: Holder) => {
  await holder.modules.anoncreds.createLinkSecret()
}
