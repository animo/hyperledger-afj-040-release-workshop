import { Holder } from "../holder"
import { cyan, underscore } from "../utils"
import { log } from "../utils/log"

export const createLinkSecret = async (holder: Holder) => {
  await log(
    `Creating a ${underscore("linkSecret")} for ${cyan(holder.config.label)}...`
  )
  await holder.modules.anoncreds.createLinkSecret()
}
