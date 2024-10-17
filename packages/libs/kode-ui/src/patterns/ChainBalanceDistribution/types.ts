export interface IChainBalanceDistributionProps {
  chains: IChainBalanceProps[];
}

export interface IChainBalanceProps {
  chainId: string;
  percentage?: number;
  balance?: number;
}
