export class NetworkConfig {
  networkHost: string;
  networkId: string;
  apiVersion: string;

  private constructor(
    networkHost: string,
    networkId: string,
    apiVersion: string,
  ) {
    this.networkHost = networkHost;
    this.networkId = networkId;
    this.apiVersion = apiVersion;
  }

  static async create(networkHost: string): Promise<NetworkConfig> {
    const { networkId, apiVersion } = await getNetworkId(networkHost);
    return new NetworkConfig(networkHost, networkId, apiVersion);
  }
}

export async function getNetworkId(
  newtorkHost: string,
): Promise<{ networkId: string; apiVersion: string }> {
  const res = await fetch(`${newtorkHost}/info`);
  const data = await res.json();

  if (!data.nodeVersion) throw new Error('Network Id not found');
  if (!data.nodeApiVersion) throw new Error('API Version not found');

  return {
    networkId: data.nodeVersion,
    apiVersion: data.nodeApiVersion,
  };
}
