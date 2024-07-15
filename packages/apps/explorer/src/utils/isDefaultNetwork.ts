import type { INetwork } from '@/context/types';
import { getDefaultNetworks } from './getDefaultNetworks';

export const isDefaultNetwork = (network: INetwork): boolean => {
  return !!getDefaultNetworks().find(
    (n) => n?.label === network.label && n.networkId === network.networkId,
  );
};
