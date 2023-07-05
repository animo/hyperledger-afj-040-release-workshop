import {
  Agent,
  ConnectionsModule,
  HttpOutboundTransport,
  InitConfig,
  LogLevel,
  WsOutboundTransport,
} from "@aries-framework/core"
import { IndySdkModule } from "@aries-framework/indy-sdk"
import { HttpInboundTransport, agentDependencies } from "@aries-framework/node"
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

const indySdkModules = {
  indySdk: new IndySdkModule({
    indySdk,
    networks: [bcorvinTestNetwork],
  }),
  connections: new ConnectionsModule({ autoAcceptConnections: true }),
}

const sharedComponentsModules = {
  askar: new AskarModule({ ariesAskar }),
  connections: new ConnectionsModule({ autoAcceptConnections: true }),
  indyVdr: new IndyVdrModule({ indyVdr, networks: [bcorvinTestNetwork] }),
  anoncreds: new AnonCredsModule({
    registries: [new IndyVdrAnonCredsRegistry()],
  }),
  anoncredsRs: new AnonCredsRsModule({
    anoncreds,
  }),
}

export const indySdkholder = new Agent<typeof indySdkModules>({
  config,
  modules: indySdkModules,
  dependencies: agentDependencies,
})

export const sharedComponentsHolder = new Agent<typeof sharedComponentsModules>(
  {
    config,
    modules: sharedComponentsModules,
    dependencies: agentDependencies,
  }
)

sharedComponentsHolder.registerOutboundTransport(new HttpOutboundTransport())
sharedComponentsHolder.registerOutboundTransport(new WsOutboundTransport())
sharedComponentsHolder.registerInboundTransport(
  new HttpInboundTransport({ port: 3002 })
)
