import { Agent, InitConfig, LogLevel } from "@aries-framework/core"
import { AgentModulesInput } from "@aries-framework/core/build/agent/AgentModules"
import { IndySdkModule } from "@aries-framework/indy-sdk"
import { agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrModule,
} from "@aries-framework/indy-vdr"
import { AnonCredsModule } from "@aries-framework/anoncreds"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"

import indySdk from "indy-sdk"

import { ariesAskar } from "@hyperledger/aries-askar-nodejs"
import { indyVdr } from "@hyperledger/indy-vdr-nodejs"
import { anoncreds } from "@hyperledger/anoncreds-nodejs"

import { bcorvinTestNetwork } from "../constants"
import { NamedConsoleLogger } from "../utils"

const name = "holder"
const config: InitConfig = {
  label: name,
  logger: new NamedConsoleLogger(LogLevel.trace, name, "green"),
  walletConfig: {
    id: "hyperledger-afj-040-release-workshop-holder",
    key: "insecure-secret",
  },
}

const indySdkModules: AgentModulesInput = {
  indySdk: new IndySdkModule({
    indySdk,
    networks: [bcorvinTestNetwork],
  }),
}

const sharedComponentsModules: AgentModulesInput = {
  askar: new AskarModule({ ariesAskar }),
  indyVdr: new IndyVdrModule({ indyVdr, networks: [bcorvinTestNetwork] }),
  anoncreds: new AnonCredsModule({
    registries: [new IndyVdrAnonCredsRegistry()],
  }),
  anoncredsRs: new AnonCredsRsModule({
    anoncreds,
  }),
}

type IndySdkModules = typeof indySdkModules
export const indySdkholder = new Agent<IndySdkModules>({
  config,
  modules: indySdkModules,
  dependencies: agentDependencies,
})

type SharedComponentsModules = typeof indySdkModules
export const sharedComponentsHolder = new Agent<SharedComponentsModules>({
  config,
  modules: sharedComponentsModules,
  dependencies: agentDependencies,
})
