import type { networkConstants } from '@/constants/network';

export type INetwork = Omit<
  typeof networkConstants.mainnet01,
  'chainwebUrl' | 'explorerUrl'
> & {
  chainwebUrl?: string;
  explorerUrl?: string;
};

export interface INetworkContext {
  networks: INetwork[];
  activeNetwork: INetwork;
  setActiveNetwork: (activeNetwork: INetwork['networkId']) => void;
  addNetwork: (newNetwork: INetwork) => void;
  removeNetwork: (newNetwork: INetwork) => void;
}
