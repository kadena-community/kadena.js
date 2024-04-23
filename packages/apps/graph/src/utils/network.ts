import { dotenv } from './dotenv';

interface INetworkData {
  networkId: string;
  apiVersion: string;
}

export let networkData: INetworkData;

export async function getNetworkConfig(
  newtorkHost = dotenv.NETWORK_HOST,
): Promise<INetworkData> {
  if (networkData) {
    return networkData;
  }

  const res = await fetch(`${newtorkHost}/info`);
  const data: { nodeVersion?: string; nodeApiVersion?: string } =
    await res.json();

  if (!data.nodeVersion) throw new Error('Network Id not found');
  if (!data.nodeApiVersion) throw new Error('API Version not found');

  // eslint-disable-next-line require-atomic-updates
  networkData = {
    networkId: data.nodeVersion,
    apiVersion: data.nodeApiVersion,
  };

  return networkData;
}
