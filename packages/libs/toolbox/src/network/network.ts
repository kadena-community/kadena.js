import { PactToolboxClient } from '../client';
import type { NetworkConfig, PactToolboxConfigObj } from '../config';
import {
  getNetworkConfig,
  isDevNetworkConfig,
  isLocalChainwebNetworkConfig,
  isLocalNetwork,
  isPactServerNetworkConfig,
} from '../config';
import {
  deployPreludes,
  downloadPreludes,
  isPreludeDownloaded,
  shouldDownloadPreludes,
} from '../prelude';
import type {
  CreateProxyServerOptions,
  PactToolboxProxyServer,
} from '../proxy';
import { createProxyServer } from '../proxy';
import { logger } from '../utils';
import { LocalChainwebNetwork } from './networks/chainweb';
import { LocalDevNetNetwork } from './networks/devnet';
import { PactServerNetwork } from './networks/pactServer';
import type { ToolboxNetworkApi, ToolboxNetworkStartOptions } from './types';

export function createPactToolboxNetwork(
  network: NetworkConfig,
): ToolboxNetworkApi {
  if (isPactServerNetworkConfig(network)) {
    return new PactServerNetwork(network);
  }
  if (isDevNetworkConfig(network)) {
    return new LocalDevNetNetwork(network);
  }

  if (isLocalChainwebNetworkConfig(network)) {
    return new LocalChainwebNetwork(network);
  }
  throw new Error(`Unsupported network type`);
}

export interface StartLocalNetworkOptions extends ToolboxNetworkStartOptions {
  client?: PactToolboxClient;
  logAccounts?: boolean;
  network?: string;
  port?: number;
  enableProxy?: boolean;
  proxyOptions?: CreateProxyServerOptions;
}

export class PactToolboxNetwork implements ToolboxNetworkApi {
  public id = 'pact-toolbox';
  private networkApi: ToolboxNetworkApi;
  private networkConfig: NetworkConfig;
  private proxy?: PactToolboxProxyServer;
  private client: PactToolboxClient;
  private proxyPort = 8080;
  private startOptions: StartLocalNetworkOptions;

  constructor(
    private toolboxConfig: PactToolboxConfigObj,
    startOptions: StartLocalNetworkOptions = {},
  ) {
    this.startOptions = {
      silent: true,
      logAccounts: false,
      port: 8080,
      enableProxy: true,
      isStateless: false,
      ...startOptions,
    };
    const networkConfig = getNetworkConfig(
      this.toolboxConfig,
      this.startOptions.network,
    );
    if (!networkConfig) {
      throw new Error(`Network ${networkConfig} not found in config`);
    }
    if (!isLocalNetwork(networkConfig)) {
      throw new Error(
        `Network ${networkConfig.name} is not a local or devnet network`,
      );
    }
    this.networkConfig = networkConfig;
    this.client =
      this.startOptions.client ?? new PactToolboxClient(toolboxConfig);
    this.networkApi = createPactToolboxNetwork(this.networkConfig);
    this.proxyPort =
      (this.networkConfig as any).proxyPort ?? this.startOptions.port;
    if (this.startOptions.enableProxy) {
      this.proxy = createProxyServer(this.networkApi, {
        port: this.proxyPort,
        ...this.startOptions.proxyOptions,
      });
    }
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

  async start(options?: ToolboxNetworkStartOptions) {
    const preludes = this.toolboxConfig.preludes ?? [];
    const contractsDir = this.toolboxConfig.contractsDir ?? 'contracts';
    const preludeConfig = {
      client: this.client,
      contractsDir,
      preludes,
    };
    const needDownloadPreludes =
      this.toolboxConfig.downloadPreludes &&
      (await shouldDownloadPreludes(preludeConfig));

    if (needDownloadPreludes) {
      // download preludes
      await downloadPreludes(preludeConfig);
    }
    await this.networkApi.start({
      ...this.startOptions,
      ...options,
    });
    logger.success(
      `Network ${this.networkConfig.name} started at ${this.getUrl()}`,
    );
    await this.proxy?.start();
    if (this.toolboxConfig.deployPreludes) {
      await deployPreludes(preludeConfig);
    }

    if (this.startOptions.logAccounts) {
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
  config: PactToolboxConfigObj,
  options: StartLocalNetworkOptions = {},
) {
  const network = new PactToolboxNetwork(config, options);
  try {
    await network.start(options);
    return network;
  } catch (e) {
    await network.stop();
    throw e;
  }
}
