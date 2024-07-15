import { networkConstants } from '@/constants/network';
import type { INetworkContext } from '@/context/types';

export const getDefaultNetworks = (): INetworkContext['networks'] => [
  networkConstants.mainnet01,
  networkConstants.testnet04,
];
