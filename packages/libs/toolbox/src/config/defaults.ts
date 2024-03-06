import { defu } from 'defu';
import { join } from 'node:path';
import type {
  ChainwebMiningClientConfig,
  ChainwebNetworkConfig,
  ChainwebNodeConfig,
  DevNetworkConfig,
  KeysetConfig,
  LocalChainwebNetworkConfig,
  PactServerConfig,
  PactServerNetworkConfig,
  PactToolboxConfigObj,
  Signer,
} from './config';
import { createChainwebRpcUrl } from './utils';

export const defaultSigners: Signer[] = [
  {
    account: 'sender00',
    publicKey:
      '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
    secretKey:
      '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  },
  {
    account: 'sender01',
    publicKey:
      '6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7',
    secretKey:
      '2beae45b29e850e6b1882ae245b0bab7d0689ebdd0cd777d4314d24d7024b4f7',
  },
  {
    account: 'sender02',
    publicKey:
      '3a9dd532d73dace195dbb64d1dba6572fb783d0fdd324685e32fbda2f89f99a6',
    secretKey:
      '9b54e924f7acdb03ad4e471308f9a512dac26a50398b41cab8bfe7a496804dbd',
  },
  {
    account: 'sender03',
    publicKey:
      '43f2adb1de192000cb3777bacc7f983b6614fd9c1715cd44cd484b6d3a0d34c8',
    secretKey:
      'a477c755abcaaac7bc9aadfc616c0cb7a8a9df9e15adc168e39c247c648544ac',
  },
  {
    account: 'sender04',
    publicKey:
      '2d70aa4f697c3a3b8dd6d97745ac074edcfd0eb65c37774cde25135483bea71e',
    secretKey:
      '1685ef1cb774a517fdfd5c08cf1ae898084d8ad39b04717a4b5b27c2a3190a75',
  },
  {
    account: 'sender05',
    publicKey:
      'f09d8f6394aea425fe6783d88cd81363d8017f16afd3711c575be0f5cd5c9bb9',
    secretKey:
      '2505b87dca474955597fed38178df9e66b16b0c8dc140817c0ad75bd14be32d4',
  },
  {
    account: 'sender06',
    publicKey:
      '5ffc1f7fef7a44738625762f75a4229454951e03f2afc6f81309c0c1bdf9ee6f',
    secretKey:
      'c2873d7226845228a6422d15599aa9371a6cd105d29f6157c07d4e9f5b5d7a3c',
  },
  {
    account: 'sender07',
    publicKey:
      '4c31dc9ee7f24177f78b6f518012a208326e2af1f37bb0a2405b5056d0cad628',
    secretKey:
      'f1c1923e49cb23d15fe45bdc3f65d7fc1d031ce50dd81bb5085bdd2c63364d7f',
  },
  {
    account: 'sender08',
    publicKey:
      '63b2eba4ed70d4612d3e7bc90db2fbf4c76f7b074363e86d73f0bc617f8e8b81',
    secretKey:
      'e0018d4e39736c9c22400cdd88ef60f0ca203466bb27b8435a72e0868289690d',
  },
  {
    account: 'sender09',
    publicKey:
      'c59d9840b0b66090836546b7eb4a73606257527ec8c2b482300fd229264b07e6',
    secretKey:
      'adbe3793a0daf70c7e7a5d59349e0f51d928178de55c6328302ef5b628ed448b',
  },
];

export const defaultKeysets: Record<string, KeysetConfig> =
  defaultSigners.reduce(
    (acc, signer) => ({
      ...acc,
      [signer.account]: {
        keys: [signer.publicKey],
        pred: 'keys-all',
      },
    }),
    {},
  );

export const defaultMeta = {
  ttl: 30_000,
  gasLimit: 100_000,
  gasPrice: 0.000_000_01,
};

export function createPactServerConfig(
  overrides?: Partial<PactServerConfig>,
): Required<PactServerConfig> {
  const defaults = {
    port: 9091,
    logDir: '.pact-toolbox/logs',
    persistDir: '.pact-toolbox/persist',
    verbose: true,
    pragmas: [],
    execConfig: ['DisablePact44', 'AllowReadInLocal'],
  };
  return {
    ...defaults,
    ...overrides,
  } as Required<PactServerConfig>;
}

export const defaultDevNetContainer = {
  port: 9090,
  image: 'kadena/devnet',
  tag: 'latest',
  // volume: 'kadena_devnet',
  name: 'devnet',
};

export function createLocalNetworkConfig(
  overrides?: Partial<PactServerNetworkConfig>,
): PactServerNetworkConfig {
  const defaults = {
    type: 'pact-server',
    rpcUrl: 'http://localhost:{port}',
    networkId: 'local',
    signers: defaultSigners,
    keysets: defaultKeysets,
    chainId: '0',
    senderAccount: 'sender00',
    autoStart: true,
    proxyPort: 8080,
    serverConfig: createPactServerConfig(),
    ...defaultMeta,
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
    chainId: '0',
    signers: defaultSigners,
    keysets: defaultKeysets,
    senderAccount: 'sender00',
    autoStart: true,
    onDemandMining: false,
    containerConfig: defaultDevNetContainer,
    proxyPort: 8080,
    ...defaultMeta,
  } as DevNetworkConfig;
  return defu(overrides ?? {}, defaults) as DevNetworkConfig;
}

export const chainwebConfigDir = join(process.cwd(), '.pact-toolbox');
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
    databaseDirectory: join(process.cwd(), '.pact-toolbox/chainweb/db'),
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
    chainId: '0',
    signers: defaultSigners,
    keysets: defaultKeysets,
    senderAccount: 'sender00',
    autoStart: true,
    nodeConfig: createChainwebNodeConfig(),
    miningClientConfig: createChainWebMiningClientConfig(),
    onDemandMining: true,
    proxyPort: 8080,
    ...defaultMeta,
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
    chainId: '0',
    signers: [],
    keysets: {},
    senderAccount: '',
    ...defaultMeta,
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
    chainId: '0',
    signers: [],
    keysets: {},
    senderAccount: '',
    ...defaultMeta,
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
    chainId: '0',
    signers: [],
    keysets: {},
    senderAccount: '',
    ...defaultMeta,
  } as ChainwebNetworkConfig;

  return defu(overrides ?? {}, defaults) as ChainwebNetworkConfig;
}

export const defaultConfig: PactToolboxConfigObj = {
  defaultNetwork: 'local',
  networks: {},
  contractsDir: 'pact',
  scriptsDir: 'scripts',
  preludes: ['kadena/chainweb'],
  deployPreludes: true,
  downloadPreludes: false,
};
