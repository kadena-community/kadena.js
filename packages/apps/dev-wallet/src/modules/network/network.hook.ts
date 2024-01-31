import { useEffect, useState } from 'react';
import { INetwork, createNetworkRepository } from './network.repository';

export function useNetwork() {
  const [networks, setNetworks] = useState<INetwork[]>([]);

  const fetchNetworks = async () => {
    const networkRepository = await createNetworkRepository();
    const networks = (await networkRepository.getNetworkList()) ?? [];
    setNetworks(networks);
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  return {
    networks,
  };
}
