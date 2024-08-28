import type { INetwork } from '@/constants/network';
import { getDefaultNetworks } from './getDefaultNetworks';

export const isDefaultNetwork = (network: INetwork): boolean => {
  return !!getDefaultNetworks().find(
    (n) => n?.slug === network.slug && n.networkId === network.networkId,
  );
};
