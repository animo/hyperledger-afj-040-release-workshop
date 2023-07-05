import {
  Agent,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
} from "@aries-framework/core"

export const returnWhenConnected = (
  agent: Agent,
  outOfBandRecordId: string
): Promise<string> => {
  return new Promise((resolve) => {
    agent.events.on<ConnectionStateChangedEvent>(
      ConnectionEventTypes.ConnectionStateChanged,
      ({ payload }) => {
        if (payload.connectionRecord.outOfBandId !== outOfBandRecordId) return
        if (payload.connectionRecord.isReady) {
          resolve(payload.connectionRecord.id)
        }
      }
    )
  })
}
