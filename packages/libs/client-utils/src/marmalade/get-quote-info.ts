import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { ChainId, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetAuctionDetailsInput {
  saleId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getQuoteInfo = async ({
  saleId,
  chainId,
  host,
  networkId,
}: IGetAuctionDetailsInput) =>
  pipe(
    () => Pact.modules['marmalade-v2.policy-manager']['get-quote-info'](saleId),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-v2.policy-manager']['get-quote-info']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
