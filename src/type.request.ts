export type PostConnectorRequest = {
  name: NonNullable<string>,
  config: NonNullable<{
    name: string
  }>
}
export type PutConnectorRequest = {
  name: NonNullable<string>,
  config?: {
    name: string
  }
}
export type ValidateConfigRequest = PutConnectorRequest
