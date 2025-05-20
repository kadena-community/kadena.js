import type { INetworkContext } from '@/contexts/NetworkContext/NetworkContext';
import { NetworkContext } from '@/contexts/NetworkContext/NetworkContext';
import { useContext } from 'react';

export const useNetwork = (): INetworkContext => useContext(NetworkContext);
