import { useCallback, useEffect, useState } from 'react';
import { dbService } from '../db/db.service';
import { useWallet } from '../wallet/wallet.hook';
import { INetwork, networkRepository } from './network.repository';

export function useNetwork() {
  const [networks, setNetworks] = useState<INetwork[]>([]);
  const { setActiveNetwork, activeNetwork } = useWallet();
  if (!setActiveNetwork) {
    throw new Error('useNetwork must be used within a WalletProvider');
  }

  const retrieveNetworks = useCallback(async () => {
    const networks = (await networkRepository.getNetworkList()) ?? [];
    setNetworks(networks);
    setActiveNetwork(
      networks.filter((network) => network.networkId === 'testnet04')[0],
    );
  }, [setActiveNetwork]);

  useEffect(() => {
    retrieveNetworks();
  }, [retrieveNetworks]);

  // subscribe to db changes and update the context
  useEffect(() => {
    const unsubscribe = dbService.subscribe(async (event, storeName) => {
      if (!['add', 'update', 'delete'].includes(event)) return;
      // update the context when the db changes
      switch (storeName) {
        case 'network': {
          {
            const networks = (await networkRepository.getNetworkList()) ?? [];
            setNetworks(networks);
            break;
          }
        }
        default:
          break;
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setNetworks]);

  return {
    networks,
    activeNetwork,
    retrieveNetworks,
    setActiveNetwork,
  };
}
