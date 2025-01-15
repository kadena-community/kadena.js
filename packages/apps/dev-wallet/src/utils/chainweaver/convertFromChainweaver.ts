import {
  ChainweaverKeyPair,
  ExportFromChainweaver,
  StoreFrontendData,
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

function processData(data: StoreFrontendData): StoreFrontendData {
  // if "StoreFrontend_Wallet_Tokens" is not present, return empty array
  if (data[1][0][0] !== 'StoreFrontend_Wallet_Tokens') {
    return [
      data[0],
      [['StoreFrontend_Wallet_Tokens', []], {}],
      data[1],
      data[2],
      data[3],
      data[4],
      data[5],
    ] as unknown as StoreFrontendData;
  }

  return data;
}
