import {
  Agent,
  AutoAcceptProof,
  ConnectionsModule,
  DidsModule,
  HttpOutboundTransport,
  InitConfig,
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

import { bcovrinTestNetwork } from "./constants"

const name = "verifier"
const config: InitConfig = {
  label: name,
  endpoints: ["http://localhost:3010"],
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

export const verifier = new Agent<typeof modules>({
  config,
  modules,
  dependencies: agentDependencies,
})

export type Verifier = typeof verifier

verifier.registerOutboundTransport(new HttpOutboundTransport())
verifier.registerOutboundTransport(new WsOutboundTransport())
verifier.registerInboundTransport(new HttpInboundTransport({ port: 3010 }))
