import { PactToolboxClient } from '../client';
import type { PactToolboxConfigObj } from '../config';
import { getNetworkConfig, resolveConfig } from '../config';
import { PactToolboxNetwork } from '../network';
import { logger } from '../utils';
import {
  disablePersistance,
  injectNetworkConfig,
  setupWalletsMocks,
  updatePorts,
} from './utils';

export interface PactTestEnv {
  client: PactToolboxClient;
  stop: () => Promise<void>;
  start: () => Promise<void>;
  restart: () => Promise<void>;
  config: PactToolboxConfigObj;
}

export interface CreatePactTestEnvOptions {
  network?: string;
  client?: PactToolboxClient;
  configOverrides?: Partial<PactToolboxConfigObj>;
  config?: Required<PactToolboxConfigObj>;
  noPersistence?: boolean;
  enableProxy?: boolean;
}
export async function createPactTestEnv({
  network,
  noPersistence = true,
  client,
  config,
  configOverrides,
  enableProxy = true,
}: CreatePactTestEnvOptions = {}): Promise<PactTestEnv> {
  logger.pauseLogs();
  if (!config) {
    config = await resolveConfig(configOverrides);
  }

  if (network) {
    config.defaultNetwork = network;
  }
  const networkConfig = getNetworkConfig(config);
  await updatePorts(networkConfig, enableProxy);

  injectNetworkConfig(config);
  setupWalletsMocks();

  if (!client) {
    client = new PactToolboxClient(config);
  }

  if (noPersistence) {
    if (network) {
      disablePersistance(networkConfig);
    }
  }

  const localNetwork = new PactToolboxNetwork(config, {
    client,
    silent: true,
    logAccounts: false,
    enableProxy,
    isStateless: true,
  });
  return {
    start: async () => localNetwork.start(),
    stop: async () => localNetwork.stop(),
    restart: async () => localNetwork.restart(),
    client,
    config,
  };
}
