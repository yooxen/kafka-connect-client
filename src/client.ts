import axios, { AxiosRequestConfig } from 'axios';
import IClient from './client.interface';
import * as request from "./type.request";
import * as response from "./type.response";

type OperationType = 'pause' | 'resume' | 'restart';
type MethodType = 'put' | 'post';

export default class Client implements IClient {

  private urls: string[];
  private config: object = {};

  constructor(urls: string | string[], config: object = {}) {
    if (typeof urls === 'string') {
      this.urls = urls.split(',');
    }
    else if (urls.length > 0) {
      this.urls = urls
    }
    else {
      this.urls = [];
    }
    if (!this.urls.length) {
      throw "Empty urls"
    }
    this.config = config;
  }

  async ping(conf: AxiosRequestConfig = {}): Promise<boolean> {
    let result = false;
    for (let url of this.urls) {
      try {
        await axios.get(url, { ...this.config, ...conf });
        result = true;
        break;
      } catch (e) {
        result = false;
      }
    }
    return result;
  }

  private async createOrUpdateConnector(connector: request.PostConnectorRequest | request.PutConnectorRequest, isNew: boolean, conf: AxiosRequestConfig = {}) {
    const { config } = connector;
    const method = isNew ? 'post' : 'put';
    const data = isNew ? { name: config.name, config } : config;

    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const uri = isNew ? `${url}/connectors` : `${url}/connectors/${connector.name}/config`;
        const response = await axios[method](uri, data, { ...this.config, ...conf });
        result = response.data;
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return result;
  }

  addConnector(connector: request.PostConnectorRequest, conf: AxiosRequestConfig = {}): Promise<response.PostConnectorResponse> {
    return this.createOrUpdateConnector(connector, true, conf)
  }

  updateConnector(connector: request.PutConnectorRequest, conf: AxiosRequestConfig = {}): Promise<response.PutConnectorResponse> {
    return this.createOrUpdateConnector(connector, false, conf)
  }

  async getConnector(connectorName: string, conf: AxiosRequestConfig = {}): Promise<response.GetConnectorResponse> {
    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const response = await axios.get(`${url}/connectors/${connectorName}`, { ...this.config, ...conf });
        result = response.data;
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return result;
  }

  async getConnectorStatus(connectorName: string, conf: AxiosRequestConfig = {}): Promise<response.GetConnectorStatusResponse> {
    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const response = await axios.get(`${url}/connectors/${connectorName}/status`, { ...this.config, ...conf });
        result = response.data;
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return result;
  }

  async performOperation(connectorName: string, operation: OperationType, method: MethodType, conf: AxiosRequestConfig = {}) {
    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const response = await axios[method](`${url}/connectors/${connectorName}/${operation}`, {}, { ...this.config, ...conf });
        result = {
          status: response.status,
          data: response.data,
          statusText: response.statusText
        };
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return result;
  }

  pause(connectorName: string, conf: AxiosRequestConfig = {}): Promise<response.PerformOperationResponse> {
    return this.performOperation(connectorName, 'pause', 'put', conf)
  }

  resume(connectorName: string, conf: AxiosRequestConfig = {}): Promise<response.PerformOperationResponse> {
    return this.performOperation(connectorName, 'resume', 'put', conf)
  }

  restart(connectorName: string, conf: AxiosRequestConfig = {}): Promise<response.PerformOperationResponse> {
    return this.performOperation(connectorName, 'restart', 'post', conf)
  }

  async deleteConnector(connectorName: string, conf: AxiosRequestConfig = {}): Promise<response.PerformOperationResponse> {
    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const response = await axios.delete(`${url}/connectors/${connectorName}`, { ...this.config, ...conf });
        result = {
          status: response.status,
          data: response.data,
          statusText: response.statusText
        };
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return result;
  }

  async getAllConnectors(conf: AxiosRequestConfig = {}): Promise<response.GetConnectorResponse[]> {
    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const connectors = await axios.get(`${url}/connectors`, { ...this.config, ...conf });
        const items = connectors.data.map(async (name: string) => {
          return await this.getConnector(name, conf)
        });
        result = Promise.all(items);
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return (await result).map(item => <response.GetConnectorResponse> item);
  }

  async getConnectorPlugins(conf: AxiosRequestConfig = {}): Promise<response.GetConnectorPluginResponse[]> {
    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const response = await axios.get(`${url}/connector-plugins`, { ...this.config, ...conf });
        result = response.data;
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return result;
  }

  async validateConfig(connectorClass: string, config: request.ValidateConfigRequest, conf: AxiosRequestConfig = {}):
    Promise<response.ValidateConfigResponse> {
    let result;
    let exception;
    for (let url of this.urls) {
      try {
        const response = await axios({
          url: `${url}/connector-plugins/${connectorClass}/config/validate`,
          method: 'PUT',
          data: config,
          ...{ ...this.config, ...conf },
        });
        result = response.data;
        break;
      } catch (e) {
        exception = e;
      }
    }
    if (exception && !result) {
      throw exception;
    }
    return result;
  }

}
