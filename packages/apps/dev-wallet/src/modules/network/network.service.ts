import { getHostUrl, INetworkOptions } from '@kadena/client';
import { INetwork } from './network.repository';

export const fetchNetworkId = async (host: string) =>
  fetch(host.endsWith('/') ? `${host}info` : `${host}/info`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network is not healthy');
    })
    .then((data) => {
      return data.nodeVersion;
    })
    .catch(() => {
      return undefined;
    });

export const hostUrlGenerator = (networks: INetwork[]) => {
  let healthyNetworks = networks;
  let lastCheckTime = Date.now();
  const checkNetworks = async () => {
    lastCheckTime = Date.now();
    healthyNetworks = await Promise.all(
      networks.map(async (network) => {
        const hosts = await Promise.all(
          network.hosts.map(async (host) => {
            const nodeVersion = await fetchNetworkId(host.url);
            return {
              ...host,
              isHealthy: nodeVersion === network.networkId,
              checkTime: Date.now(),
            };
          }),
        );
        return {
          ...network,
          hosts: hosts.filter((host) => host.isHealthy),
        };
      }),
    );
  };
  checkNetworks();
  return ({ networkId, chainId }: INetworkOptions) => {
    if (Date.now() - lastCheckTime > 30000) {
      checkNetworks();
    }
    const network = healthyNetworks.find(
      (network) => network.networkId === networkId,
    );
    const host = network?.hosts.find(
      (host) => host.submit && host.read && host.confirm,
    );
    if (!host) {
      throw new Error('No healthy host found');
    }
    return getHostUrl(host.url)({ networkId, chainId });
  };
};
