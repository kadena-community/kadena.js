import type {
  ChainwebChainId,
  ICommandResult,
} from '@kadena/chainweb-node-client';
import { details } from '@kadena/client-utils/coin';
import { useQuery } from '@tanstack/react-query';

const useAccountDetails = (
  accountName: string,
  networkId: string,
  chainId: ChainwebChainId,
) => {
  const query = useQuery({
    queryKey: ['account-details', accountName, networkId, chainId],
    queryFn: () =>
      details(accountName, networkId, chainId) as Promise<ICommandResult>,
    enabled: !!accountName,
    select: (x) => {
      switch (x.result.status) {
        case 'success':
          return x.result;

        default:
          return x.result;
      }
    },
  });

  return query;
};

export default useAccountDetails;
