import type { INetwork } from '@/contexts/NetworkContext/NetworkContext';
import type { BuiltInPredicate, ChainId } from '@kadena/client';
import type { IDiscoveredAccount } from '@kadena/client-utils/coin';
import { discoverAccount as discoverAccountUtil } from '@kadena/client-utils/coin';
import { PactNumber } from '@kadena/pactjs';

export interface IRetrievedAccount {
  alias?: string;
  address: string;
  chains: Array<{ chainId: ChainId; balance: string }>;
  overallBalance: string;
  guard: any;
  keysToSignWith?: string[];
}

export interface KeysetGuard {
  keys: string[];
  pred: BuiltInPredicate;
}

export type IKeysetGuard = KeysetGuard & {
  principal: string;
};

const getAccount = (
  address: string,
  chainResult: Array<{
    chainId: ChainId | undefined;
    result: IDiscoveredAccount | undefined;
  }>,
): IRetrievedAccount[] => {
  const accounts = chainResult.reduce(
    (acc, data) => {
      const { details, principal } = data.result ?? {};
      const balance = new PactNumber(details?.balance ?? '0').toDecimal();
      if (!data.chainId || !data.result || !details || !principal) return acc;
      const key = principal;
      if (!acc[key]) {
        const item: IRetrievedAccount = {
          address,
          overallBalance: new PactNumber(details.balance).toString(),
          guard: { ...details.guard, principal },
          chains: [
            {
              chainId: data.chainId,
              balance: balance,
            },
          ],
        };
        return { ...acc, [key]: item };
      }
      return {
        ...acc,
        [key]: {
          ...acc[key],
          overallBalance: new PactNumber(acc[key]!.overallBalance ?? '0')
            .plus(new PactNumber(details.balance))
            .toDecimal(),
          chains: acc[key]!.chains!.concat({
            chainId: data.chainId,
            balance: balance,
          }),
        },
      };
    },
    {} as Record<string, IRetrievedAccount>,
  );
  return Object.values(accounts);
};

export const discoverAccount = async (
  addressProp: string,
  network: INetwork,
) => {
  let address = addressProp;
  let wGuard: any | undefined;
  if (addressProp.startsWith('w:')) {
    const chunks = addressProp.split(':');
    if (chunks.length > 3) {
      address = `${chunks[0]}:${chunks[1]}:${chunks[2]}`;
      wGuard = {
        pred: chunks[2] as 'keys-all' | 'keys-any' | 'keys-2',
        keys: chunks.slice(3),
        principal: address,
      };
    }
  }

  const result = await discoverAccountUtil(
    address,
    network.networkId,
    network.host,
    'coin',
  )
    .execute()
    .catch(() => []);

  const rec = getAccount(address, result);

  if (rec.length === 0) {
    if (wGuard) {
      rec.push({
        address: address,
        overallBalance: '0',
        chains: [],
        guard: wGuard,
      });
    } else if (address.startsWith('k:') && address.length === 66) {
      rec.push({
        address: address,
        overallBalance: '0',
        chains: [],
        guard: {
          pred: 'keys-all' as const,
          keys: [address.split('k:')[1]],
          principal: address,
        },
      });
    }
  }

  return rec;
};
