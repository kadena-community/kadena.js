import type { NonFungibleTokenBalance } from '@/__generated__/sdk';
import { useGetTokensQuery } from '@/__generated__/sdk';
import { useMemo } from 'react';
import { useAccount } from '../account';

export const useGetAllProofOfUs: IDataHook<NonFungibleTokenBalance[]> = () => {
  const { account } = useAccount();

  const { data, loading: isLoading } = useGetTokensQuery({
    variables: {
      accountName: account?.accountName ?? '',
    },
  });

  const tokens: NonFungibleTokenBalance[] = useMemo(() => {
    return (data?.nonFungibleAccount?.nonFungibles ??
      []) as NonFungibleTokenBalance[];
  }, [data?.nonFungibleAccount?.nonFungibles.length]);

  return {
    isLoading,
    data: tokens,
    error: undefined,
  };
};
