import type { ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'pathe';
import type {
  ChainwebMiningClientConfig,
  ChainwebNodeConfig,
  LocalChainwebNetworkConfig,
} from '../../config';
import {
  createChainWebMiningClientConfig,
  createChainwebNodeConfig,
} from '../../config';
import {
  didMakeBlocks,
  getUuid,
  isChainWebAtHeight,
  isChainWebNodeOk,
  pollFn,
  runBin,
} from '../../utils';
import type { ToolboxNetworkApi } from '../types';

const chainwebNodeBin = 'chainweb-node';
const chainwebMiningClientBin = 'chainweb-mining-client';

export async function startChainWebNode(
  config: ChainwebNodeConfig,
  id: string,
  silent = true,
) {
  const knownPeerInfo = config.knownPeerInfo.replace(
    /:\d+/,
    `:${config.p2pPort}`,
  );
  return runBin(
    chainwebNodeBin,
    [
      `--config-file=${config.configFile}`,
      `--p2p-certificate-chain-file=${config.p2pCertificateChainFile}`,
      `--p2p-certificate-key-file=${config.p2pCertificateKeyFile}`,
      `--p2p-hostname=${config.p2pHostname}`,
      `--p2p-port=${config.p2pPort}`,
      `--bootstrap-reachability=${config.bootstrapReachability}`,
      `--cluster-id=${config.clusterId}`,
      `--p2p-max-session-count=${config.p2pMaxSessionCount}`,
      `--mempool-p2p-max-session-count=${config.mempoolP2pMaxSessionCount}`,
      `--known-peer-info=${knownPeerInfo}`,
      `--log-level=${config.logLevel}`,
      `--mining-public-key=${config.miningPublicKey}`,
      `--service-port=${config.servicePort}`,
      `--database-directory=${join(config.databaseDirectory, id)}`,
      config.headerStream ? `--header-stream` : '',
      config.rosetta ? `--rosetta` : '',
      config.allowReadsInLocal ? `--allowReadsInLocal` : '',
      config.disablePow ? `--disable-pow` : '',
      config.enableMiningCoordination ? `--enable-mining-coordination` : '',
    ].filter(Boolean),
    { silent },
  );
}

export async function startChainWebMiningClient(
  config: ChainwebMiningClientConfig,
  node: string,
  silent = true,
) {
  return runBin(
    chainwebMiningClientBin,
    [
      `--public-key=${config.publicKey}`,
      `--node=${node}`,
      `--worker=${config.worker}`,
      `--on-demand-port=${config.onDemandPort}`,
      `--stratum-port=${config.stratumPort}`,
      `--constant-delay-block-time=${config.constantDelayBlockTime}`,
      `--thread-count=${config.threadCount}`,
      `--log-level=${config.logLevel}`,
      config.noTls ? `--no-tls` : '',
    ],
    { silent },
  );
}

export class LocalChainwebNetwork implements ToolboxNetworkApi {
  public id = getUuid();
  private chainwebNodeProcess?: ChildProcessWithoutNullStreams;
  private miningClientProcess?: ChildProcessWithoutNullStreams;
  private nodeConfig: ChainwebNodeConfig;
  private miningClientConfig: ChainwebMiningClientConfig;

  constructor(
    private network: LocalChainwebNetworkConfig,
    private silent = true,
    private isStateless: boolean = false,
  ) {
    this.nodeConfig = createChainwebNodeConfig(this.network.nodeConfig);
    this.miningClientConfig = createChainWebMiningClientConfig(
      this.network.miningClientConfig,
    );
  }

  getServicePort() {
    return this.nodeConfig.servicePort;
  }

  isOnDemandMining(): boolean {
    return this.miningClientConfig.worker === 'on-demand';
  }

  getOnDemandUrl() {
    return `http://localhost:${this.miningClientConfig.onDemandPort}`;
  }

  getServiceUrl() {
    return `http://localhost:${this.nodeConfig.servicePort}`;
  }

  async isOk() {
    return isChainWebNodeOk(this.getServiceUrl());
  }

  async start() {
    // clean up old db
    const dbDir = join(
      this.nodeConfig.databaseDirectory,
      this.isStateless ? this.id : '',
    );
    if (!this.nodeConfig.persistDb && existsSync(dbDir)) {
      await rm(dbDir, { recursive: true, force: true });
    }
    this.chainwebNodeProcess = await startChainWebNode(
      this.nodeConfig,
      this.isStateless ? this.id : '',
      this.silent,
    );
    await pollFn(() => isChainWebNodeOk(this.getServiceUrl()), 10000);
    const node = `127.0.0.1:${this.nodeConfig.servicePort}`;
    this.miningClientProcess = await startChainWebMiningClient(
      this.miningClientConfig,
      node,
      this.silent,
    );

    if (this.isOnDemandMining()) {
      try {
        await pollFn(
          () =>
            didMakeBlocks({
              count: 5,
              onDemandUrl: this.getOnDemandUrl(),
            }),
          10000,
        );
      } catch (e) {
        throw new Error('Could not make initial blocks for on-demand mining');
      }
    }

    try {
      await pollFn(() => isChainWebAtHeight(20, this.getServiceUrl()), 10000);
    } catch (e) {
      throw new Error('Chainweb node did not reach height 20');
    }
  }

  async stop() {
    this.chainwebNodeProcess?.kill();
    this.miningClientProcess?.kill();
    await rm(this.nodeConfig.databaseDirectory, {
      recursive: true,
      force: true,
    });
  }

  async restart() {
    await this.stop();
    await this.start();
  }
}

export async function startLocalChainWebNetwork(
  network: LocalChainwebNetworkConfig,
  silent = true,
) {
  const process = new LocalChainwebNetwork(network, silent);
  await process.start();
  return process;
}
