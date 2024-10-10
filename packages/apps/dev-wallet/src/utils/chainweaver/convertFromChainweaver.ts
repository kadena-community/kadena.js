import { ChainweaverKeyPair, ExportFromChainweaver } from './chainweaver';

export const convertFromChainweaver = (exportData: ExportFromChainweaver) => {
  const { StoreFrontend_Data, BIPStorage_Data } = exportData;
  const [
    walletKeysExtract,
    walletTokensExtract,
    walletAccountsExtract,
    networkPublicMetaExtract,
    networksExtract,
    currentNetworkExtract,
  ] = StoreFrontend_Data;

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
