import type { NetworkIds } from '@/constants/kadena';
import { DefaultValues } from '@/context/connect-wallet-context';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';

import { createClient, Pact } from '@kadena/client';

export interface IModulesResult {
  status?: string;
  data?: string[];
  chainId: ChainwebChainId;
  network: NetworkIds;
}

const chainIds = [...Array(20).keys()].map(
  (key) => `${key}` as ChainwebChainId,
);

interface IBalance {
  balance: number;
  chainId: ChainwebChainId;
}

export const getHighestBalanceChainId = async ({
  selectedNetwork,
  networksData,
}: {
  selectedNetwork: string;
  networksData: INetworkData[];
}): Promise<IBalance | null> => {
  const networkDto = networksData.find(
    (item) => item.networkId === selectedNetwork,
  );

  if (!networkDto) return null;

  const promises = chainIds.map((chainId) => {
    const { local } = createClient(
      getApiHost({
        api: networkDto.API,
        networkId: networkDto.networkId,
        chainId,
      }),
    );

    const transaction = Pact.builder
      .execution(
        `(coin.details "c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA")`,
      )
      .setMeta({
        chainId,
      })
      .setNetworkId(networkDto.networkId)
      .createTransaction();

    return local(transaction, {
      preflight: false,
      signatureVerification: false,
    });
  });

  const data = await Promise.all(promises);

  const chainBalance = data.reduce<IBalance>(
    (acc, curr, idx) => {
      const balanceResult = (curr.result as any).data?.balance ?? 0;
      const balance =
        typeof balanceResult === 'number'
          ? balanceResult
          : balanceResult.decimal;

      if (parseFloat(balance) > parseFloat(`${acc.balance}`)) {
        return {
          balance,
          chainId: `${idx}`,
        } as IBalance;
      }

      return acc;
    },
    {
      balance: 0,
      chainId: DefaultValues.CHAIN_ID,
    },
  );
  return chainBalance;
};
