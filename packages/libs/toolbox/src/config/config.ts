import type { ChainId, IKeyPair } from '@kadena/types';
import { loadConfig } from 'c12';
import { defaultConfig } from './defaults';

export interface KeysetConfig {
  keys: string[];
  pred: 'keys-all' | 'keys-any' | 'keys-2' | '=';
}

export interface GetRpcUrlParams {
  chainId?: string;
  networkId?: string;
}

export interface Signer extends IKeyPair {
  account: string | `k:${string}`;
}

export interface CommonNetworkConfig {
  rpcUrl: string;
  name?: string;
  senderAccount: string;
  signers: Signer[];
  keysets: Record<string, KeysetConfig>;
  gasLimit?: number;
  gasPrice?: number;
  chainId?: ChainId;
  networkId: string;
  ttl?: number;
}
export interface DevNetworkConfig extends CommonNetworkConfig {
  type: 'chainweb-devnet';
  autoStart?: boolean;
  onDemandMining?: boolean;
  proxyPort?: string | number;
  containerConfig?: DevNetContainerConfig;
}

export interface ChainwebMiningClientConfig {
  publicKey: string;
  worker: 'constant-delay' | 'on-demand';
  stratumPort: number;
  constantDelayBlockTime: number;
  threadCount: number;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  noTls: boolean;
  onDemandPort: number;
}

export interface ChainwebNodeConfig {
  persistDb: boolean;
  configFile: string;
  p2pCertificateChainFile: string;
  p2pCertificateKeyFile: string;
  p2pHostname: string;
  p2pPort: number;
  bootstrapReachability: number;
  clusterId: string;
  p2pMaxSessionCount: number;
  mempoolP2pMaxSessionCount: number;
  knownPeerInfo: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  enableMiningCoordination: boolean;
  miningPublicKey: string;
  headerStream: boolean;
  rosetta: boolean;
  allowReadsInLocal: boolean;
  databaseDirectory: string;
  disablePow: boolean;
  servicePort: number;
}

export interface LocalChainwebNetworkConfig extends CommonNetworkConfig {
  type: 'chainweb-local';
  autoStart?: boolean;
  proxyPort?: string | number;
  miningClientConfig?: ChainwebMiningClientConfig;
  nodeConfig?: ChainwebNodeConfig;
}

export interface PactServerNetworkConfig extends CommonNetworkConfig {
  type: 'pact-server';
  autoStart?: boolean;
  serverConfig?: PactServerConfig;
  proxyPort?: string | number;
}

export interface ChainwebNetworkConfig extends CommonNetworkConfig {
  type: 'chainweb';
}

export type NetworkConfig =
  | DevNetworkConfig
  | PactServerNetworkConfig
  | ChainwebNetworkConfig
  | LocalChainwebNetworkConfig;

export type PactExecConfigFlags =
  | 'AllowReadInLocal'
  | 'DisableHistoryInTransactionalMode'
  | 'DisableInlineMemCheck'
  | 'DisableModuleInstall'
  | 'DisableNewTrans'
  | 'DisablePact40'
  | 'DisablePact420'
  | 'DisablePact43'
  | 'DisablePact431'
  | 'DisablePact44'
  | 'DisablePact45'
  | 'DisablePact46'
  | 'DisablePact47'
  | 'DisablePact48'
  | 'DisablePact49'
  | 'DisablePactEvents'
  | 'DisableRuntimeReturnTypeChecking'
  | 'EnforceKeyFormats'
  | 'OldReadOnlyBehavior'
  | 'PreserveModuleIfacesBug'
  | 'PreserveModuleNameBug'
  | 'PreserveNsModuleInstallBug'
  | 'PreserveShowDefs';
export interface PactServerConfig {
  /**
   * HTTP server port
   */
  port?: string | number;
  /**
   * Directory for HTTP logs
   */
  logDir?: string;
  /**
   * Directory for database files. If ommitted, runs in-memory only.
   */
  persistDir?: string;
  /**
   * SQLite pragmas to use with persistence DBs
   */
  pragmas?: string[];
  /**
   * verbosity of logging
   */
  verbose?: boolean;
  /**
   * Entity name for simulating privacy, defaults to "entity"
   */
  entity?: string;

  /**
   * Pact runtime execution flags
   */
  execConfig?: (PactExecConfigFlags | (string & {}))[];
  /**
   * Gas limit for each transaction, defaults to 0
   */
  gasLimit?: number;
  /**
   * Gas price per action, defaults to 0
   */
  gasRate?: number;
}

export interface DevNetContainerConfig {
  port?: string | number;
  volume?: string;
  name?: string;
  image: string;
  tag?: string;
}

type StandardPrelude = 'kadena/chainweb' | 'kadena/marmalade';
export interface PactToolboxConfigObj<
  T extends Record<string, NetworkConfig> = Record<string, NetworkConfig>,
> {
  defaultNetwork: keyof T;
  networks: T;
  contractsDir?: string;
  scriptsDir?: string;
  pactVersion?: string;
  preludes?: StandardPrelude[];
  downloadPreludes?: boolean;
  deployPreludes?: boolean;
}

export type PactToolboxConfig<T extends Record<string, NetworkConfig> = {}> =
  | Partial<PactToolboxConfigObj<T>>
  | ((network: string) => Partial<PactToolboxConfigObj<T>>);

export async function resolveConfig(overrides?: Partial<PactToolboxConfigObj>) {
  const configResult = await loadConfig<PactToolboxConfigObj>({
    name: 'pact-toolbox',
    overrides: overrides as PactToolboxConfigObj,
    defaultConfig: defaultConfig as PactToolboxConfigObj,
  });
  return configResult.config as Required<PactToolboxConfigObj>;
}

export function defineConfig<
  T extends Record<string, NetworkConfig> = Record<string, NetworkConfig>,
>(config: PactToolboxConfig<T>) {
  return config;
}

export function hasOnDemandMining(
  config: NetworkConfig,
): config is DevNetworkConfig | LocalChainwebNetworkConfig {
  return 'onDemandMining' in config && !!config.onDemandMining;
}
