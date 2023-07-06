import { Holder } from "../holder"

export const createLinkSecret = async (holder: Holder) => {
  await holder.modules.anoncreds.createLinkSecret()
}
