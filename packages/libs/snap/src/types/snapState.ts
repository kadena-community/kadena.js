export type DerivedAccount = {
  index: number;
  address: string;
  name: string;
  publicKey: string;
  privateKey?: string;
};

export type Account = {
  id: string;
  index: number;
  address: string;
  name: string;
  publicKey: string;
};

export type Network = {
  id: string;
  name: string;
  networkId: string;
  blockExplorerTransaction: string;
  blockExplorerAddress: string;
  blockExplorerAddressTransactions: string;
  isTestnet: boolean;
  nodeUrl: string;
  transactionListUrl: string;
  transactionListTtl: number;
  buyPageUrl: string;
};

export type SnapState = {
  networks: Network[];
  accounts: Account[];
  hardwareAccounts: Account[];
  activeNetwork: string;
};
