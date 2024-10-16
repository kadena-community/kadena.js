export interface IChainBalanceDistributionProps {
  accountName: string;
  chains: IViewChain[];
  maxChainCount: number;
}

export interface IViewChain {
  chainId: string;
  percentage?: number;
  balance?: number;
}
