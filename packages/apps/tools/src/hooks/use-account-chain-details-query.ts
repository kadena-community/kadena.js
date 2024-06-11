import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { prefixApi } from '@/utils/network';
import { CHAINS } from '@kadena/chainweb-node-client';
import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

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
  host,
}: IParams & { host: string }): Promise<AccountAllChainsDetails[]> => {
  const something: any[] = [];
  CHAINS.forEach((chainId) => {
    const data = details(account, networkId, chainId, prefixApi(host));
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
  const { networksData } = useWalletConnectClient();

  const networkDto = networksData.find((item) => item.networkId === networkId);

  if (!networkDto) {
    throw new Error('Network not found');
  }

  return useQuery({
    queryKey: ['account-chain-details', account, networkId, networkDto.API],
    queryFn: () => fetchDetails({ account, networkId, host: networkDto.API }),
    enabled: !!account,
  });
};

export { useAccountChainDetailsQuery };
