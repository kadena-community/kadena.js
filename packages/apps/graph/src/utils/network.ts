import { dotenv } from './dotenv';

interface NetworkData {
  networkId: string;
  apiVersion: string;
}

export let networkData: NetworkData;

export async function getNetworkConfig(
  newtorkHost = dotenv.NETWORK_HOST,
): Promise<NetworkData> {
  if (networkData) {
    return networkData;
  }

  const res = await fetch(`${newtorkHost}/info`);
  const data = await res.json();

  if (!data.nodeVersion) throw new Error('Network Id not found');
  if (!data.nodeApiVersion) throw new Error('API Version not found');

  // eslint-disable-next-line require-atomic-updates
  networkData = {
    networkId: data.nodeVersion,
    apiVersion: data.nodeApiVersion,
  };

  return networkData;
}
