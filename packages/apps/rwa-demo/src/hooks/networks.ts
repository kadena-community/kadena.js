import type { INetworkContext } from '@/components/NetworkProvider/NetworkProvider';
import { NetworkContext } from '@/components/NetworkProvider/NetworkProvider';

import { useContext } from 'react';

export const useNetwork = (): INetworkContext => useContext(NetworkContext);
