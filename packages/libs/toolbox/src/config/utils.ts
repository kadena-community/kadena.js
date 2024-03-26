import { parseYAML } from 'confbox';
import { readFile, readdir } from 'fs/promises';
import { join } from 'pathe';
import type {
  ChainwebNetworkConfig,
  DevNetworkConfig,
  GetRpcUrlParams,
  LocalChainwebNetworkConfig,
  NetworkConfig,
  PactServerNetworkConfig,
  PactToolboxConfigObj,
} from './config';

export function isPactServerNetworkConfig(
  config: NetworkConfig,
): config is PactServerNetworkConfig {
  return config?.type === 'pact-server';
}

export function isDevNetworkConfig(
  config: NetworkConfig,
): config is DevNetworkConfig {
  return config?.type === 'chainweb-devnet';
}

export function isChainwebNetworkConfig(
  config: NetworkConfig,
): config is ChainwebNetworkConfig {
  return config?.type === 'chainweb';
}

export function hasOnDemandMining(
  config: NetworkConfig,
): config is DevNetworkConfig | LocalChainwebNetworkConfig {
  return 'onDemandMining' in config && !!config.onDemandMining;
}

export function isLocalChainwebNetworkConfig(
  config: NetworkConfig,
): config is LocalChainwebNetworkConfig {
  return config?.type === 'chainweb-local';
}

export function isLocalNetwork(
  config: NetworkConfig,
): config is
  | PactServerNetworkConfig
  | LocalChainwebNetworkConfig
  | DevNetworkConfig {
  return (
    (config?.type === 'pact-server' ||
      config?.type === 'chainweb-local' ||
      config?.type === 'chainweb-devnet') &&
    !!config.autoStart
  );
}

export function getNetworkPort(networkConfig: NetworkConfig) {
  const defaultPort = 8080;
  if (isLocalNetwork(networkConfig)) {
    return networkConfig.proxyPort ?? defaultPort;
  }
  return defaultPort;
}

export function getNetworkRpcUrl(networkConfig: NetworkConfig) {
  const port = getNetworkPort(networkConfig);
  const rpcUrl = networkConfig.rpcUrl ?? `http://localhost:{port}`;
  return rpcUrl.replace(/{port}/g, port.toString());
}

export function createRpcUrlGetter(
  networkConfig: NetworkConfig,
): (params: GetRpcUrlParams) => string {
  const rpcUrl = getNetworkRpcUrl(networkConfig);
  return ({
    networkId = networkConfig.networkId,
    chainId = networkConfig.meta?.chainId ?? '0',
  }) => {
    // rpcUrl could contain placeholders like {chainId} and {networkId}
    return rpcUrl.replace(/{networkId}|{chainId}/g, (match: string) =>
      match === '{networkId}' ? networkId : chainId,
    );
  };
}

interface ChainwebRpcUrlTemplate extends GetRpcUrlParams {
  host?: string;
}
export function createChainwebRpcUrl({
  host = 'http://localhost:{port}',
  chainId = '{chainId}',
  networkId = '{networkId}',
}: ChainwebRpcUrlTemplate = {}) {
  return `${host}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
}

export function getNetworkConfig(
  config: PactToolboxConfigObj,
  network?: string,
) {
  const networkName =
    network ??
    process.env.KADENA_TOOLBOX_NETWORK ??
    config.defaultNetwork ??
    'local';
  const found = config.networks[networkName];
  config.defaultNetwork = networkName;
  found.name = networkName;
  return found;
}

export function getSerializableNetworkConfig(
  config: PactToolboxConfigObj,
  isDev = true,
) {
  const network = getNetworkConfig(config);
  return {
    networkId: network.networkId,
    meta: network.meta,
    rpcUrl: getNetworkRpcUrl(network),
    senderAccount: network.senderAccount,
    type: network.type,
    keysets: network.keysets,
    name: network.name,
    ...(isDev ? { signers: network.signers } : {}),
  };
}

interface kadenaCliNetwork {
  network: string;
  networkId: string;
  networkHost: string;
  networkExplorerUrl: string;
}

export async function getKadenaCliNetwork(
  name: string,
  kadenaFolder = join(process.cwd(), '.kadena'),
) {
  if (!name.endsWith('.yaml')) {
    name = `${name}.yaml`;
  }
  const content = await readFile(join(kadenaFolder, 'networks', name), 'utf8');
  return parseYAML(content) as kadenaCliNetwork;
}

// export async function getkadenaCliNetworks(
//   kadenaFolder = join(process.cwd(), '.kadena'),
// ) {
//   const networks: Record<string, NetworkConfig> = {};
//   const files = await readdir(join(kadenaFolder, 'networks'));
//   for (const file of files) {
//     const networkConfig = await getKadenaCliNetwork(file);
//   }

//   return networks;
// }
