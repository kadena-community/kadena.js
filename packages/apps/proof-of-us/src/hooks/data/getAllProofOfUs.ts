import type { GetTokensQuery, Token } from '@/__generated__/sdk';
import { useGetTokensQuery } from '@/__generated__/sdk';
import { useAccount } from '../account';

export const useGetAllProofOfUs: IDataHook<Token[]> = () => {
  const { account } = useAccount();
  const { data, loading: isLoading } = useGetTokensQuery({
    variables: {
      accountName: account?.accountName ?? '',
    },
  });

  function getTokensArray(data: GetTokensQuery | undefined): Token[] {
    return (data?.nonFungibleAccount?.nonFungibles ?? []) as Token[];
  }

  return {
    isLoading,
    data: getTokensArray(data),
    error: undefined,
  };
};
