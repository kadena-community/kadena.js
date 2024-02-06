import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

interface IParams
  extends Omit<UseQueryOptions, 'queryKey' | 'queryFn' | 'enabled'> {
  account: string;
  networkId: string;
  chainId: ChainId;
}

const schema = z.object({
  account: z.string(),
  balance: z.number(),
  guard: z.object({
    pred: z.string(),
    keys: z.array(z.string()),
  }),
});

type AccountDetails = z.infer<typeof schema>;

const fetchDetails = async ({
  account,
  networkId,
  chainId,
}: IParams): Promise<AccountDetails> => {
  const result = await details(account, networkId, chainId);

  const parsed = schema.parse(result);

  return parsed;
};

const useAccountDetailsQuery = ({
  account,
  networkId,
  chainId,
  ...rest
}: IParams) => {
  return useQuery({
    queryKey: ['account-details', account, networkId, chainId],
    queryFn: () => fetchDetails({ account, networkId, chainId }),
    enabled: !!account,
    ...(rest as UseQueryOptions),
  });
};

export { fetchDetails, useAccountDetailsQuery };
