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
import { IndySdkModule } from "@aries-framework/indy-sdk"
import { HttpInboundTransport, agentDependencies } from "@aries-framework/node"
import { AskarModule } from "@aries-framework/askar"

import indySdk from "indy-sdk"

import { ariesAskar } from "@hyperledger/aries-askar-nodejs"
import { NamedConsoleLogger } from "../utils"

const name = "holder"
const config: InitConfig = {
  label: name,
  endpoints: ["http://localhost:3002"],
  logger: new NamedConsoleLogger(LogLevel.trace, name, "green"),
  walletConfig: {
    id: "hyperledger-afj-040-release-workshop-holder",
    key: "insecure-secret",
  },
}

const indySdkModules = {
  indySdk: new IndySdkModule({ indySdk }),
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

const sharedComponentsModules = {
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

export const indySdkHolder = new Agent<typeof indySdkModules>({
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

indySdkHolder.registerOutboundTransport(new HttpOutboundTransport())
indySdkHolder.registerOutboundTransport(new WsOutboundTransport())
indySdkHolder.registerInboundTransport(new HttpInboundTransport({ port: 3002 }))

sharedComponentsHolder.registerOutboundTransport(new HttpOutboundTransport())
sharedComponentsHolder.registerOutboundTransport(new WsOutboundTransport())
sharedComponentsHolder.registerInboundTransport(
  new HttpInboundTransport({ port: 3002 })
)
