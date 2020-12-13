import Client from "./client";

export default function(urls: string | string[], config: object = {}) {
  return new Client(urls, config)
}
