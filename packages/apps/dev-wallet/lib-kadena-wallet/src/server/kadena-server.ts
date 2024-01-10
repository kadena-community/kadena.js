import { resolveAccountAlias } from "../registry/registry.js";
import { RemoteConnectionServer } from "./remote-server.js";

export class KadenaRemoteServer extends RemoteConnectionServer {
  constructor(connectionId?: string) {
    super(connectionId);
    this.setHandler("resolveAlias", this.resolveAlias);
  }

  async resolveAlias(alias: string) {
    return resolveAccountAlias(alias);
  }
}
