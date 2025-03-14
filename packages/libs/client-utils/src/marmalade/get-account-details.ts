import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { ChainId, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetAccountBalanceInput {
  tokenId: string;
  accountName: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getAccountDetails = async ({
  tokenId,
  accountName,
  chainId,
  networkId,
  host,
}: IGetAccountBalanceInput) => {
  const result = await pipe(
    () => Pact.modules['marmalade-v2.ledger'].details(tokenId, accountName),
    execution,
    dirtyReadClient<
      PactReturnType<IPactModules['marmalade-v2.ledger']['details']>
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();

  return result;
};
