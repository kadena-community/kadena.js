import type { Token } from '@/__generated__/sdk';
import { useGetTokensQuery } from '@/__generated__/sdk';
import { useAccount } from '../account';

export const useGetAllProofOfUs: IDataHook<Token[]> = () => {
  const { account } = useAccount();
  if (!account)
    return {
      data: [],
      isLoading: false,
    };
  const { data, loading: isLoading } = useGetTokensQuery({
    variables: {
      accountName: account.accountName,
    },
  });

  const tokensArray = data?.nonFungibleAccount?.nonFungibles ?? [];

  return {
    isLoading,
    data: tokensArray as Token[],
    error: undefined,
  };
};
