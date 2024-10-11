import { ChainId, IPactCommand } from '@kadena/client';

export type ChainweaverKeyPair = {
  pair: {
    private: string;
    public: string;
  };
};

type StoreFrontendData = [
  TupleExport<'StoreFrontend_Wallet_Keys', Array<[number, ChainweaverKeyPair]>>,
  TupleExport<
    'StoreFrontend_Wallet_Tokens',
    Record<NetworkLabel, Array<TokenIdentifier>>
  >,
  TupleExport<
    'StoreFrontend_Wallet_Accounts',
    Record<
      NetworkLabel,
      Record<
        AccountName,
        { chains: Record<ChainId, Record<string, never>>; notes?: string }
      >
    >
  >,
  TupleExport<'StoreFrontend_Network_PublicMeta', PublicMeta>,
  TupleExport<
    'StoreFrontend_Network_Networks',
    Record<NetworkLabel, Array<NodeHosts>>
  >,
  TupleExport<'StoreFrontend_Network_SelectedNetwork', NetworkLabel>,
  TupleExport<'StoreFrontend_ModuleExplorer_SessionFile', string>,
];

type NetworkLabel = string;
type TokenIdentifier = {
  namespace: string | null;
  name: string;
};
type AccountName = string;
type PublicMeta = IPactCommand['meta'];
type NodeHosts = string;

type TupleExport<T extends string, U> = [[T, []], U];

type RootkeyString = string;
export type ExportFromChainweaver = {
  StoreFrontend_Version: number;
  StoreFrontend_Data: StoreFrontendData;
  BIPStorage_Data: [TupleExport<'BIPStorage_RootKey', RootkeyString>];
} & Record<string, unknown>;
