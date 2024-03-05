export class NetworkConfig {
  networkHost: string;
  networkId: string;

  private constructor(networkHost: string, networkId: string) {
    this.networkHost = networkHost;
    this.networkId = networkId;
  }

  static async create(networkHost: string): Promise<NetworkConfig> {
    const networkId = await getNetworkId(networkHost);
    return new NetworkConfig(networkHost, networkId);
  }
}

export async function getNetworkId(newtorkHost: string): Promise<string> {
  const res = await fetch(`${newtorkHost}/info`);
  const data = await res.json();

  if (!data.nodeVersion) throw new Error('Network Id not found');

  return data.nodeVersion as string;
}
