import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import { useQuery } from '@tanstack/react-query';
import * as z from 'zod';

interface IParams {
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

export type AccountDetails = z.infer<typeof schema>;

const fetchDetails = async ({
  account,
  networkId,
  chainId,
}: IParams): Promise<AccountDetails> => {
  console.log('fetchDetails', account, networkId, chainId);
  const result = await details(
    account,
    networkId,
    chainId,
    'http://localhost:8080/',
  );

  //http://localhost:8080/chainweb/0.0/development/chain/0/pact/chainweb/0.0/development/chain/10/pact/api/v1/local?preflight=false&signatureVerification=false

  const parsed = schema.parse(result);

  return parsed;
};

const useAccountDetailsQuery = ({ account, networkId, chainId }: IParams) => {
  return useQuery({
    queryKey: ['account-details', account, networkId, chainId],
    queryFn: () => fetchDetails({ account, networkId, chainId }),
    enabled: !!account,
    retry: false,
  });
};

export { fetchDetails, useAccountDetailsQuery };
