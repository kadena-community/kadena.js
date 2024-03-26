import { defu } from 'defu';
import { join } from 'pathe';
import type {
  ChainwebMiningClientConfig,
  ChainwebNetworkConfig,
  ChainwebNodeConfig,
  DevNetworkConfig,
  LocalChainwebNetworkConfig,
  PactServerConfig,
  PactServerNetworkConfig,
} from './config';
import {
  chainwebConfigDir,
  defaultDevNetContainer,
  defaultKeysets,
  defaultMeta,
  defaultSigners,
} from './defaults';
import { createChainwebRpcUrl, getKadenaCliNetwork } from './utils';

export function createPactServerConfig(
  overrides?: Partial<PactServerConfig>,
): Required<PactServerConfig> {
  const defaults = {
    port: 9091,
    logDir: '.kadena/toolbox/pact/logs',
    persistDir: '.kadena/toolbox/pact/persist',
    verbose: true,
    pragmas: [],
    execConfig: ['DisablePact44', 'AllowReadInLocal'],
  };
  return {
    ...defaults,
    ...overrides,
  } as Required<PactServerConfig>;
}

export function createLocalNetworkConfig(
  overrides?: Partial<PactServerNetworkConfig>,
): PactServerNetworkConfig {
  const defaults = {
    type: 'pact-server',
    rpcUrl: 'http://localhost:{port}',
    networkId: 'local',
    signers: defaultSigners,
    keysets: defaultKeysets,
    senderAccount: 'sender00',
    autoStart: true,
    proxyPort: 8080,
    serverConfig: createPactServerConfig(),
    meta: defaultMeta,
  } as PactServerNetworkConfig;
  return defu(overrides ?? {}, defaults) as PactServerNetworkConfig;
}

export function createDevNetNetworkConfig(
  overrides?: Partial<DevNetworkConfig>,
): DevNetworkConfig {
  const containerPort = overrides?.containerConfig?.port;
  const proxyPort = overrides?.proxyPort;
  if (
    containerPort &&
    proxyPort &&
    containerPort.toString() === proxyPort.toString()
  ) {
    throw new Error(`DevNet container port must be different from proxy port`);
  }

  const defaults = {
    type: 'chainweb-devnet',
    rpcUrl: createChainwebRpcUrl(),
    networkId: 'development',
    signers: defaultSigners,
    keysets: defaultKeysets,
    senderAccount: 'sender00',
    autoStart: true,
    onDemandMining: false,
    containerConfig: defaultDevNetContainer,
    proxyPort: 8080,
    meta: defaultMeta,
  } as DevNetworkConfig;
  return defu(overrides ?? {}, defaults) as DevNetworkConfig;
}

export function createChainwebNodeConfig(
  overrides?: Partial<ChainwebNodeConfig>,
  configDir = chainwebConfigDir,
): ChainwebNodeConfig {
  const defaults = {
    persistDb: true,
    configFile: join(configDir, 'chainweb-node.common.yaml'),
    p2pCertificateChainFile: join(configDir, 'devnet-bootstrap-node.cert.pem'),
    p2pCertificateKeyFile: join(configDir, 'devnet-bootstrap-node.key.pem'),
    p2pHostname: 'bootstrap-node',
    p2pPort: 1789,
    bootstrapReachability: 1,
    clusterId: 'devnet-minimal',
    p2pMaxSessionCount: 1,
    mempoolP2pMaxSessionCount: 1,
    knownPeerInfo:
      'YNo8pXthYQ9RQKv1bbpQf2R5LcLYA3ppx2BL2Hf8fIM@bootstrap-node:1789',
    logLevel: 'info',
    enableMiningCoordination: true,
    miningPublicKey:
      'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
    headerStream: true,
    rosetta: false,
    allowReadsInLocal: true,
    databaseDirectory: join(process.cwd(), '.kadena/toolbox/chainweb/db'),
    disablePow: true,
    servicePort: 1848,
  } as ChainwebNodeConfig;
  return {
    ...defaults,
    ...overrides,
  };
}

export function createChainWebMiningClientConfig(
  overrides?: Partial<ChainwebMiningClientConfig>,
): ChainwebMiningClientConfig {
  const defaults = {
    publicKey:
      'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
    worker: 'on-demand',
    constantDelayBlockTime: 5,
    threadCount: 1,
    logLevel: 'info',
    noTls: true,
    onDemandPort: 9090,
    stratumPort: 1917,
  } as ChainwebMiningClientConfig;
  return {
    ...defaults,
    ...overrides,
  };
}

export function createLocalChainwebNetworkConfig(
  overrides?: Partial<LocalChainwebNetworkConfig>,
): LocalChainwebNetworkConfig {
  const defaults = {
    type: 'chainweb-local',
    rpcUrl: createChainwebRpcUrl(),
    networkId: 'development',
    signers: defaultSigners,
    keysets: defaultKeysets,
    senderAccount: 'sender00',
    autoStart: true,
    nodeConfig: createChainwebNodeConfig(),
    miningClientConfig: createChainWebMiningClientConfig(),
    onDemandMining: true,
    proxyPort: 8080,
    meta: defaultMeta,
  } as LocalChainwebNetworkConfig;
  return defu(overrides ?? {}, defaults) as LocalChainwebNetworkConfig;
}

export function createChainwebNetworkConfig(
  overrides?: Partial<ChainwebNetworkConfig>,
): ChainwebNetworkConfig {
  const defaults = {
    type: 'chainweb',
    rpcUrl: createChainwebRpcUrl({
      host: 'https://testnet.chainweb.com',
    }),
    networkId: 'testnet04',
    signers: [],
    keysets: {},
    senderAccount: '',
    meta: defaultMeta,
  } as ChainwebNetworkConfig;

  return defu(overrides ?? {}, defaults) as ChainwebNetworkConfig;
}
export function createTestNetNetworkConfig(
  overrides?: Partial<ChainwebNetworkConfig>,
): ChainwebNetworkConfig {
  const defaults = {
    type: 'chainweb',
    rpcUrl: createChainwebRpcUrl({
      host: 'https://testnet.chainweb.com',
    }),
    networkId: 'testnet04',
    signers: [],
    keysets: {},
    senderAccount: '',
    meta: defaultMeta,
  } as ChainwebNetworkConfig;

  return defu(overrides ?? {}, defaults) as ChainwebNetworkConfig;
}

export function createMainNetNetworkConfig(
  overrides?: Partial<ChainwebNetworkConfig>,
): ChainwebNetworkConfig {
  const defaults = {
    type: 'chainweb',
    rpcUrl: createChainwebRpcUrl({
      host: 'https://mainnet.chainweb.com',
    }),
    networkId: 'mainnet01',
    signers: [],
    keysets: {},
    senderAccount: '',
    meta: defaultMeta,
  } as ChainwebNetworkConfig;

  return defu(overrides ?? {}, defaults) as ChainwebNetworkConfig;
}
