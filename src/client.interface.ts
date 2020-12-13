import { AxiosRequestConfig } from 'axios';
import * as request from './type.request';
import * as response from './type.response';

export default interface IClient {
  ping(conf: AxiosRequestConfig): Promise<boolean>;
  addConnector(connector: request.PostConnectorRequest, conf: AxiosRequestConfig): Promise<response.PostConnectorResponse>;
  updateConnector(connector: request.PutConnectorRequest, conf: AxiosRequestConfig): Promise<response.PutConnectorResponse>;
  getConnector(connectorName: string, conf: AxiosRequestConfig): Promise<response.GetConnectorResponse>;
  getConnectorStatus(connectorName: string, conf: AxiosRequestConfig): Promise<response.GetConnectorStatusResponse>;
  pause(connectorName: string, conf: AxiosRequestConfig): Promise<response.PerformOperationResponse>;
  resume(connectorName: string, conf: AxiosRequestConfig): Promise<response.PerformOperationResponse>;
  restart(connectorName: string, conf: AxiosRequestConfig): Promise<response.PerformOperationResponse>;
  deleteConnector(connectorName: string, conf: AxiosRequestConfig): Promise<response.PerformOperationResponse>;
  getAllConnectors(conf: AxiosRequestConfig): Promise<response.GetConnectorResponse[]>;
  getConnectorPlugins(conf: AxiosRequestConfig): Promise<response.GetConnectorPluginResponse[]>;
  validateConfig(connectorClass: string, config: request.ValidateConfigRequest, conf: AxiosRequestConfig): Promise<response.ValidateConfigResponse>;
}
