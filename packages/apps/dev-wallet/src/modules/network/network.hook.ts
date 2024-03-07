import { useCallback, useEffect, useState } from 'react';
import { INetwork, networkRepository } from './network.repository';

export function useNetwork() {
  const [networks, setNetworks] = useState<INetwork[]>([]);
  const [activeNetwork, setActiveNetwork] = useState<INetwork | undefined>(
    undefined,
  );

  const retrieveNetworks = useCallback(async () => {
    const networks = (await networkRepository.getNetworkList()) ?? [];
    setNetworks(networks);
    setActiveNetwork(
      networks.filter((network) => network.networkId === 'testnet04')[0],
    );
  }, []);

  const addNetwork = useCallback(
    async (network: INetwork) => {
      await networkRepository.addNetwork(network);
      await retrieveNetworks();
    },
    [retrieveNetworks],
  );

  const updateNetwork = useCallback(
    async (network: INetwork) => {
      await networkRepository.updateNetwork(network);
      await retrieveNetworks();
    },
    [retrieveNetworks],
  );

  const deleteNetwork = useCallback(
    async (networkId: string) => {
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
    activeNetwork,
    addNetwork,
    updateNetwork,
    deleteNetwork,
    retrieveNetworks,
    setActiveNetwork,
  };
}
