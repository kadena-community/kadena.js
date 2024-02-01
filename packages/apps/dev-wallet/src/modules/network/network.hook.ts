import { useCallback, useEffect, useState } from 'react';
import { INetwork, createNetworkRepository } from './network.repository';

export function useNetwork() {
  const [networks, setNetworks] = useState<INetwork[]>([]);

  const retrieveNetworks = useCallback(async () => {
    const networkRepository = await createNetworkRepository();
    const networks = (await networkRepository.getNetworkList()) ?? [];
    setNetworks(networks);
  }, []);

  const addNetwork = useCallback(
    async (network: INetwork) => {
      const networkRepository = await createNetworkRepository();
      await networkRepository.addNetwork(network);
      await retrieveNetworks();
    },
    [retrieveNetworks],
  );

  const updateNetwork = useCallback(
    async (network: INetwork) => {
      const networkRepository = await createNetworkRepository();
      await networkRepository.updateNetwork(network);
      await retrieveNetworks();
    },
    [retrieveNetworks],
  );

  const deleteNetwork = useCallback(
    async (networkId: string) => {
      const networkRepository = await createNetworkRepository();
      await networkRepository.deleteNetwork(networkId);
      await retrieveNetworks();
    },
    [retrieveNetworks],
  );

  useEffect(() => {
    retrieveNetworks();
  }, [retrieveNetworks]);

  return {
    networks,
    addNetwork,
    updateNetwork,
    deleteNetwork,
    retrieveNetworks,
  };
}
