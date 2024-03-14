import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { prefixApi } from '@/utils/network';
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
  host,
}: IParams & { host: string }): Promise<AccountDetails> => {
  const result = await details(account, networkId, chainId, prefixApi(host));

  const parsed = schema.parse(result);

  return parsed;
};

const useAccountDetailsQuery = ({ account, networkId, chainId }: IParams) => {
  const { networksData } = useWalletConnectClient();

  const networkDto = networksData.find((item) => item.networkId === networkId);

  if (!networkDto) {
    throw new Error('Network not found');
  }

  return useQuery({
    queryKey: ['account-details', account, networkId, chainId, networkDto.API],
    queryFn: () =>
      fetchDetails({ account, networkId, chainId, host: networkDto.API }),
    enabled: !!account && !!chainId,
    retry: false,
  });
};

export { fetchDetails, useAccountDetailsQuery };
