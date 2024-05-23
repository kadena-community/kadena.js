import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateBidIdInput {
  saleId: string;
  bidderAccount: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const createBidId = ({
  saleId,
  bidderAccount,
  chainId,
  networkId,
  host,
}: ICreateBidIdInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-sale.conventional-auction']['create-bid-id'](
        saleId,
        bidderAccount,
      ),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-sale.conventional-auction']['create-bid-id']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
