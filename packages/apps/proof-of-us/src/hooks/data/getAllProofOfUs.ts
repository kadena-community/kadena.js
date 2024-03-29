import type { Token } from '@/__generated__/sdk';
import { useGetTokensQuery } from '@/__generated__/sdk';
import { useMemo } from 'react';
import { useAccount } from '../account';

export const useGetAllProofOfUs: IDataHook<Token[]> = () => {
  const { account } = useAccount();

  const { data, loading: isLoading } = useGetTokensQuery({
    variables: {
      accountName: account?.accountName ?? '',
    },
  });

  const tokens: Token[] = useMemo(() => {
    return (data?.nonFungibleAccount?.nonFungibles ?? []) as Token[];
  }, [data?.nonFungibleAccount?.nonFungibles.length]);

  return {
    isLoading,
    data: tokens,
    error: undefined,
  };
};
