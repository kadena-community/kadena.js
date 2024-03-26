import type { NetworkConfig, PactToolboxConfigObj } from '../config';
import {
  getSerializableNetworkConfig,
  isDevNetworkConfig,
  isLocalChainwebNetworkConfig,
  isLocalNetwork,
  isPactServerNetworkConfig,
} from '../config';
import { getRandomNetworkPorts } from '../utils';
import { mockEckoWallet } from '../wallet';

export function disablePersistance(network: NetworkConfig) {
  if (isPactServerNetworkConfig(network) && network.serverConfig?.persistDir) {
    network.serverConfig.persistDir = undefined;
  }

  if (isDevNetworkConfig(network) && network.containerConfig?.volume) {
    network.containerConfig.volume = undefined;
  }

  if (isLocalChainwebNetworkConfig(network) && network.nodeConfig?.persistDb) {
    network.nodeConfig.persistDb = false;
  }

  return network;
}

export function getConfigOverrides(
  configOverrides?: Partial<PactToolboxConfigObj> | string,
): Partial<PactToolboxConfigObj> {
  if (typeof configOverrides === 'string') {
    return {
      defaultNetwork: configOverrides,
    };
  }
  return configOverrides || {};
}

export function injectNetworkConfig(config: PactToolboxConfigObj) {
  const network = getSerializableNetworkConfig(config);
  (globalThis as any).__KADENA_TOOLBOX_NETWORK_CONFIG__ = network;
}

export function setupWalletsMocks() {
  mockEckoWallet();
}
export async function updatePorts(
  network: NetworkConfig,
  enableProxy: boolean = false,
) {
  const ports = await getRandomNetworkPorts();
  if (isLocalNetwork(network)) {
    network.proxyPort = enableProxy ? ports.proxy : ports.service;
  }

  if (isPactServerNetworkConfig(network)) {
    if (network.serverConfig) {
      network.serverConfig.port = ports.service;
    }
  }
  if (isDevNetworkConfig(network)) {
    if (network.containerConfig) {
      network.containerConfig.port = ports.service;
    }
  }
  if (isLocalChainwebNetworkConfig(network)) {
    if (network.miningClientConfig) {
      network.miningClientConfig.onDemandPort = ports.onDemand;
      network.miningClientConfig.stratumPort = ports.stratum;
    }
    if (network.nodeConfig) {
      network.nodeConfig.servicePort = ports.service;
      network.nodeConfig.p2pPort = ports.p2p;
    }
  }

  return network;
}
