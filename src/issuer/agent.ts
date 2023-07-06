import {
  Agent,
  AutoAcceptCredential,
  ConnectionsModule,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  InitConfig,
  V2CredentialProtocol,
  WsOutboundTransport,
} from "@aries-framework/core"
import { HttpInboundTransport, agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"

import { ariesAskar } from "@hyperledger/aries-askar-nodejs"
import {
  AnonCredsCredentialFormatService,
  AnonCredsModule,
} from "@aries-framework/anoncreds"
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
} from "@aries-framework/indy-vdr"
import { anoncreds } from "@hyperledger/anoncreds-nodejs"
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs"
import { indyVdr } from "@hyperledger/indy-vdr-nodejs"
import { bcovrinTestNetwork } from "../constants"

const name = "issuer"
const config: InitConfig = {
  label: name,
  // logger: new NamedConsoleLogger(LogLevel.trace, name, "green"),
  endpoints: ["http://localhost:3001"],
  walletConfig: {
    id: "hyperledger-afj-040-release-workshop-issuer",
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
    registrars: [new IndyVdrIndyDidRegistrar()],
    resolvers: [new IndyVdrIndyDidResolver()],
  }),
  indyVdr: new IndyVdrModule({
    indyVdr,
    networks: [bcovrinTestNetwork],
  }),
  connections: new ConnectionsModule({ autoAcceptConnections: true }),
  credentials: new CredentialsModule({
    autoAcceptCredentials: AutoAcceptCredential.Always,
    credentialProtocols: [
      new V2CredentialProtocol({
        credentialFormats: [new AnonCredsCredentialFormatService()],
      }),
    ],
  }),
}

type IssuerModules = typeof modules
export const issuer = new Agent<IssuerModules>({
  config,
  modules,
  dependencies: agentDependencies,
})

export type Issuer = Agent<IssuerModules>

issuer.registerOutboundTransport(new HttpOutboundTransport())
issuer.registerOutboundTransport(new WsOutboundTransport())
issuer.registerInboundTransport(new HttpInboundTransport({ port: 3001 }))
