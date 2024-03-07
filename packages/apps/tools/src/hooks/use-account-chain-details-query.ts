import { CHAINS } from '@kadena/chainweb-node-client';
import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

interface IParams {
  account: string;
  networkId: string;
}

const schema = z.object({
  account: z.string(),
  balance: z.number(),
  guard: z.object({
    pred: z.string(),
    keys: z.array(z.string()),
  }),
});

export type AccountDetails = z.infer<typeof schema>;

export interface AccountAllChainsDetails {
  chainId: ChainId;
  data: AccountDetails | undefined;
}

const fetchDetails = async ({
  account,
  networkId,
}: IParams): Promise<AccountAllChainsDetails[]> => {
  const something: any[] = [];
  CHAINS.forEach((chainId) => {
    const data = details(account, networkId, chainId);
    something.push(data);
  });
  const promisesArr = await Promise.allSettled(something);

  return promisesArr.map((data, index) => {
    if (data.status === 'rejected') {
      return {
        chainId: CHAINS[index],
        data: undefined,
      };
    }
    return {
      chainId: CHAINS[index],
      data: schema.parse(data.value),
    };
  });
};

const useAccountChainDetailsQuery = ({ account, networkId }: IParams) => {
  return useQuery({
    queryKey: ['account-chain-details', account, networkId],
    queryFn: () => fetchDetails({ account, networkId }),
    enabled: !!account,
  });
};

export { useAccountChainDetailsQuery };
