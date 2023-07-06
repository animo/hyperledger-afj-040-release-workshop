import {
  Agent,
  AutoAcceptCredential,
  ConnectionsModule,
  CredentialsModule,
  HttpOutboundTransport,
  InitConfig,
  JsonLdCredentialFormatService,
  LogLevel,
  V2CredentialProtocol,
  WsOutboundTransport,
} from "@aries-framework/core"
import { HttpInboundTransport, agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"

import { ariesAskar } from "@hyperledger/aries-askar-nodejs"
import { NamedConsoleLogger } from "../utils"

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
  connections: new ConnectionsModule({ autoAcceptConnections: true }),
  credentials: new CredentialsModule({
    autoAcceptCredentials: AutoAcceptCredential.Always,
    credentialProtocols: [
      new V2CredentialProtocol({
        credentialFormats: [new JsonLdCredentialFormatService()],
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
