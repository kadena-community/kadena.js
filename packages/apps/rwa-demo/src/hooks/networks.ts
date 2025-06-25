import type { INetworkContext } from '@/contexts/NetworkContext/NetworkContext';
import { NetworkContext } from '@/contexts/NetworkContext/NetworkContext';
import { useContext } from 'react';

export const useNetwork = (): INetworkContext => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkContextProvider');
  }
  return context;
};
