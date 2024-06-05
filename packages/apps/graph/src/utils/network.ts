import { dotenv } from './dotenv';

interface INetworkData {
  networkId: string;
  apiVersion: string;
  chainIds: string[];
  chainNeighbors: Map<string, string[]>;
}

export let networkData: INetworkData;

export async function initializeNetworkConfig(
  networkHost = dotenv.NETWORK_HOST,
): Promise<INetworkData> {
  if (networkData) {
    return networkData;
  }

  const res = await fetch(`${networkHost}/info`);
  const data: {
    nodeVersion?: string;
    nodeApiVersion?: string;
    nodeChains?: string[];
    nodeGraphHistory?: [[number, [[number, [number]]]]];
  } = await res.json();

  if (!data.nodeVersion) throw new Error('Network Id not found');
  if (!data.nodeApiVersion) throw new Error('API Version not found');
  if (!data.nodeChains) throw new Error('ChainIDs not found');
  if (!data.nodeGraphHistory) throw new Error('Graph History not found');

  const chainNeighbors = new Map<string, string[]>();

  for (const chain of data.nodeGraphHistory[0][1].sort((a, b) => a[0] - b[0])) {
    chainNeighbors.set(
      chain[0].toString(),
      chain[1].map((n) => n.toString()),
    );
  }

  // eslint-disable-next-line require-atomic-updates
  networkData = {
    networkId: data.nodeVersion,
    apiVersion: data.nodeApiVersion,
    chainIds: data.nodeChains.sort(),
    chainNeighbors,
  };

  return networkData;
}
