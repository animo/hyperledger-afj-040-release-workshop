import {
  Agent,
  ConnectionsModule,
  HttpOutboundTransport,
  InitConfig,
  LogLevel,
  WsOutboundTransport,
} from "@aries-framework/core"
import { HttpInboundTransport, agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrModule,
} from "@aries-framework/indy-vdr"
import { AnonCredsModule } from "@aries-framework/anoncreds"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"

import { ariesAskar } from "@hyperledger/aries-askar-nodejs"
import { indyVdr } from "@hyperledger/indy-vdr-nodejs"
import { anoncreds } from "@hyperledger/anoncreds-nodejs"

import { bcorvinTestNetwork } from "../constants"
import { NamedConsoleLogger } from "../utils"

const name = "verifier"
const config: InitConfig = {
  label: name,
  logger: new NamedConsoleLogger(LogLevel.trace, name, "green"),
  walletConfig: {
    id: "hyperledger-afj-040-release-workshop-verifier",
    key: "insecure-secret",
  },
}

const modules = {
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

type SharedComponentsModules = typeof modules
export const sharedComponentsVerifier = new Agent<SharedComponentsModules>({
  config,
  modules,
  dependencies: agentDependencies,
})

sharedComponentsVerifier.registerOutboundTransport(new HttpOutboundTransport())
sharedComponentsVerifier.registerOutboundTransport(new WsOutboundTransport())
sharedComponentsVerifier.registerInboundTransport(
  new HttpInboundTransport({ port: 3000 })
)
