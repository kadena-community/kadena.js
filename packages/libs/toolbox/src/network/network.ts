import { PactToolboxClient } from '../client';
import type { NetworkConfig, PactToolboxConfigObj } from '../config';
import {
  getNetworkConfig,
  isDevNetworkConfig,
  isLocalChainwebNetworkConfig,
  isLocalNetwork,
  isPactServerNetworkConfig,
} from '../config';
import { deployPreludes, downloadPreludes } from '../prelude';
import type {
  CreateProxyServerOptions,
  PactToolboxProxyServer,
} from '../proxy';
import { createProxyServer } from '../proxy';
import { logger } from '../utils';
import { LocalChainwebNetwork } from './networks/chainweb';
import { LocalDevNetNetwork } from './networks/devnet';
import { PactServerNetwork } from './networks/pactServer';
import type { PactToolboxNetworkApi } from './types';

export function createPactToolboxNetwork(
  network: NetworkConfig,
  silent: boolean,
  isStateless: boolean,
): PactToolboxNetworkApi {
  if (isPactServerNetworkConfig(network)) {
    return new PactServerNetwork(network, silent, isStateless);
  }
  if (isDevNetworkConfig(network)) {
    return new LocalDevNetNetwork(network, silent, isStateless);
  }

  if (isLocalChainwebNetworkConfig(network)) {
    return new LocalChainwebNetwork(network, silent, isStateless);
  }
  throw new Error(`Unsupported network type`);
}

export interface StartLocalNetworkOptions {
  silent?: boolean;
  client?: PactToolboxClient;
  logAccounts?: boolean;
  network?: string;
  port?: number;
  enableProxy?: boolean;
  proxyOptions?: CreateProxyServerOptions;
  isStateless?: boolean;
}

export class PactToolboxNetwork implements PactToolboxNetworkApi {
  public id = 'pact-toolbox';
  private networkApi: PactToolboxNetworkApi;
  private networkConfig: NetworkConfig;
  private proxy?: PactToolboxProxyServer;
  private client: PactToolboxClient;
  private logAccounts: boolean;
  private proxyPort = 8080;

  constructor(
    private toolboxConfig: Required<PactToolboxConfigObj>,
    {
      network,
      client,
      silent = true,
      logAccounts = false,
      port = 8080,
      enableProxy = true,
      isStateless = false,
      proxyOptions,
    }: StartLocalNetworkOptions = {},
  ) {
    const networkConfig = getNetworkConfig(this.toolboxConfig, network);
    if (!networkConfig) {
      throw new Error(`Network ${networkConfig} not found in config`);
    }
    if (!isLocalNetwork(networkConfig)) {
      throw new Error(
        `Network ${networkConfig.name} is not a local or devnet network`,
      );
    }
    this.networkConfig = networkConfig;
    this.client = client ?? new PactToolboxClient(toolboxConfig);
    this.networkApi = createPactToolboxNetwork(
      this.networkConfig,
      silent,
      isStateless,
    );
    this.proxyPort = (this.networkConfig as any).proxyPort ?? port;
    if (enableProxy) {
      this.proxy = createProxyServer(this.networkApi, {
        port: this.proxyPort,
        ...proxyOptions,
      });
    }
    this.logAccounts = logAccounts;
  }
  getServicePort() {
    return this.networkApi.getServicePort();
  }

  isOnDemandMining() {
    return this.networkApi.isOnDemandMining();
  }

  getOnDemandUrl() {
    return this.networkApi.getOnDemandUrl();
  }

  getServiceUrl(): string {
    return this.networkApi.getServiceUrl();
  }

  getUrl() {
    if (this.proxy) {
      return `http://localhost:${this.proxyPort}`;
    }
    return this.networkApi.getServiceUrl();
  }

  getPort() {
    if (this.proxy) {
      return this.proxyPort;
    }
    return this.networkApi.getServicePort();
  }

  async start() {
    const preludes = this.toolboxConfig.preludes;
    const contractsDir = this.toolboxConfig.contractsDir;
    if (this.toolboxConfig.downloadPreludes) {
      // download preludes
      await downloadPreludes({
        client: this.client,
        contractsDir,
        preludes,
      });
    }
    await this.networkApi.start();
    logger.success(
      `Network ${this.networkConfig.name} started at ${this.getUrl()}`,
    );
    await this.proxy?.start();
    if (this.toolboxConfig.deployPreludes) {
      await deployPreludes({
        client: this.client,
        contractsDir,
        preludes,
      });
    }

    if (this.logAccounts) {
      // log all signers and keys
      const signers = this.networkConfig.signers;
      for (const signer of signers) {
        logger.log(`Account: ${signer.account}`);
        logger.log(`Public: ${signer.publicKey}`);
        logger.log(`Secret: ${signer.secretKey}`);
        logger.log('--------------------------------');
      }
    }
  }

  async restart() {
    await this.networkApi.restart();
    logger.success(
      `Network ${this.networkConfig.name} restarted at ${this.getUrl()}`,
    );
  }

  async stop() {
    await this.networkApi.stop();
    await this.proxy?.stop();
    logger.success(`Network ${this.networkConfig.name} stopped!`);
  }

  async isOk() {
    return this.networkApi.isOk();
  }
}

export async function startLocalNetwork(
  config: Required<PactToolboxConfigObj>,
  options: StartLocalNetworkOptions = {},
) {
  const network = new PactToolboxNetwork(config, options);
  try {
    await network.start();
    return network;
  } catch (e) {
    await network.stop();
    throw e;
  }
}
