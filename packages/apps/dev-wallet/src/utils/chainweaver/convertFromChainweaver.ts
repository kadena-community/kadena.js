import { IPactCommand } from '@kadena/client';
import {
  ChainweaverKeyPair,
  ExportFromChainweaver,
  StoreFrontendData,
  StoreFrontendTuple,
} from './chainweaver';

export const convertFromChainweaver = (exportData: ExportFromChainweaver) => {
  const { StoreFrontend_Data, BIPStorage_Data } = exportData;

  const [
    walletKeysExtract,
    walletTokensExtract,
    walletAccountsExtract,
    networkPublicMetaExtract,
    networksExtract,
    currentNetworkExtract,
  ] = processData(StoreFrontend_Data);

  const encryptedKeyPairs = walletKeysExtract[1].reduce(
    (acc, [key, { pair }]) => {
      acc[key] = { index: key, ...pair };
      return acc;
    },
    [] as Array<{ index: number } & ChainweaverKeyPair['pair']>,
  );

  const tokens = walletTokensExtract[1];
  const accounts = walletAccountsExtract[1];
  const publicMeta = networkPublicMetaExtract[1];
  const networks = networksExtract[1];
  const selectedNetwork = currentNetworkExtract[1];
  const rootKey = BIPStorage_Data[0][1];

  return {
    rootKey,
    encryptedKeyPairs,
    tokens,
    accounts,
    publicMeta,
    networks,
    selectedNetwork,
  };
};

function processData(data: StoreFrontendData): StoreFrontendTuple {
  const storeFrontendTuple: StoreFrontendTuple = [
    [['StoreFrontend_Wallet_Keys', []], []],
    [['StoreFrontend_Wallet_Tokens', []], {}],
    [['StoreFrontend_Wallet_Accounts', []], {}],
    [['StoreFrontend_Network_PublicMeta', []], {} as IPactCommand['meta']],
    [
      ['StoreFrontend_Network_Networks', []],
      { Mainnet: ['api.chainweb.com'], Testnet: ['api.testnet.chainweb.com'] },
    ],
    [['StoreFrontend_Network_SelectedNetwork', []], 'Mainnet'],
    [['StoreFrontend_ModuleExplorer_SessionFile', []], ''],
  ];
  data.forEach((tuple) => {
    switch (tuple[0]?.[0]) {
      case 'StoreFrontend_Wallet_Keys':
        storeFrontendTuple[0] = tuple as StoreFrontendTuple[0];
        break;
      case 'StoreFrontend_Wallet_Tokens':
        storeFrontendTuple[1] = tuple as StoreFrontendTuple[1];
        break;
      case 'StoreFrontend_Wallet_Accounts':
        storeFrontendTuple[2] = tuple as StoreFrontendTuple[2];
        break;
      case 'StoreFrontend_Network_PublicMeta':
        storeFrontendTuple[3] = tuple as StoreFrontendTuple[3];
        break;
      case 'StoreFrontend_Network_Networks':
        storeFrontendTuple[4] = tuple as StoreFrontendTuple[4];
        break;
      case 'StoreFrontend_Network_SelectedNetwork':
        storeFrontendTuple[5] = tuple as StoreFrontendTuple[5];
        break;
      case 'StoreFrontend_ModuleExplorer_SessionFile':
        storeFrontendTuple[6] = tuple as StoreFrontendTuple[6];
        break;
    }
  });

  return storeFrontendTuple;
}
