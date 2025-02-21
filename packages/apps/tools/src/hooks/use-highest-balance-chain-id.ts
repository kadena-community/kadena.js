import { useAccountQuery } from '@/__generated__/sdk';
import {
  DefaultValues,
  useWalletConnectClient,
} from '@/context/connect-wallet-context';
import { getHighestBalanceChainId } from '@/services/chains/get-highest-balance-chain-id';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { useLayoutEffect, useState } from 'react';

const useHighestBalanceChainId = () => {
  const { selectedNetwork, networksData } = useWalletConnectClient();
  const [chainID, setChainId] = useState<ChainwebChainId>(
    DefaultValues.CHAIN_ID,
  );

  const accountQueryVariables = {
    accountName: 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
  };

  const { loading, data, error } = useAccountQuery({
    variables: accountQueryVariables,
  });

  console.log({ loading, data, error });

  const init = async () => {
    const data = await getHighestBalanceChainId({
      selectedNetwork,
      networksData,
    });

    if (!data) return;

    setChainId(data?.chainId);
  };

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  return { chainID, onChainSelectChange: setChainId };
};

export default useHighestBalanceChainId;
