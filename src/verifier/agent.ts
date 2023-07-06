import {
  Agent,
  AutoAcceptProof,
  ConnectionsModule,
  DidsModule,
  HttpOutboundTransport,
  InitConfig,
  LogLevel,
  ProofsModule,
  V2ProofProtocol,
  WsOutboundTransport,
} from "@aries-framework/core"
import { HttpInboundTransport, agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
} from "@aries-framework/indy-vdr"
import {
  AnonCredsModule,
  AnonCredsProofFormatService,
} from "@aries-framework/anoncreds"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"

import { ariesAskar } from "@hyperledger/aries-askar-nodejs"
import { indyVdr } from "@hyperledger/indy-vdr-nodejs"
import { anoncreds } from "@hyperledger/anoncreds-nodejs"

import { bcovrinTestNetwork } from "../constants"
import { NamedConsoleLogger } from "../utils"

const name = "verifier"
const config: InitConfig = {
  label: name,
  endpoints: ["http://localhost:3010"],
  logger: new NamedConsoleLogger(LogLevel.trace, name, "green"),
  walletConfig: {
    id: "hyperledger-afj-040-release-workshop-verifier",
    key: "insecure-secret",
  },
}

const modules = {
  askar: new AskarModule({ ariesAskar }),
  anoncreds: new AnonCredsModule({
    registries: [new IndyVdrAnonCredsRegistry()],
  }),
  anoncredsRs: new AnonCredsRsModule({
    anoncreds,
  }),
  dids: new DidsModule({
    resolvers: [new IndyVdrIndyDidResolver()],
  }),
  indyVdr: new IndyVdrModule({
    indyVdr,
    networks: [bcovrinTestNetwork],
  }),
  connections: new ConnectionsModule({ autoAcceptConnections: true }),
  proofs: new ProofsModule({
    autoAcceptProofs: AutoAcceptProof.Always,
    proofProtocols: [
      new V2ProofProtocol({
        proofFormats: [new AnonCredsProofFormatService()],
      }),
    ],
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
  new HttpInboundTransport({ port: 3010 })
)
