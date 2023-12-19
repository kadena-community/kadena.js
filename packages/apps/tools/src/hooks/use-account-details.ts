import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { details } from '@kadena/client-utils/coin';
import { useQuery } from '@tanstack/react-query';

const useAccountDetails = (
  accountName: string,
  networkId: string,
  chainId: ChainwebChainId,
) => {
  const accountDetails = useQuery({
    queryKey: ['account-details', accountName, networkId, chainId],
    queryFn: () => details(accountName, networkId, chainId),
    enabled: !!accountName,
  });

  return accountDetails;
};

export default useAccountDetails;
