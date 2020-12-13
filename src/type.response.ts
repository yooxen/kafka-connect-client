export type GetConnectorResponse = {
  name: string,
  config: object,
  tasks: { connector: string, task: number }[]
}
export type PostConnectorResponse = GetConnectorResponse
export type PutConnectorResponse = GetConnectorResponse
export type GetConnectorStatusResponse = {
  name: string,
  connector: {
    state: string,
    worker_id: string
  },
  tasks: { id: string, state: string, worker_id: string }[]
}
export type PerformOperationResponse = {
  status: number,
  statusText: string,
  data: any,
}
export type GetConnectorPluginResponse = {
  class: string
}
export type ValidateConfigResponse = {
  name: string,
  error_count?: number,
  groups?: string[],
  configs: { definition: object, value: object }[]
}
