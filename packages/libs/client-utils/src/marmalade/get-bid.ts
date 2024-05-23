import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { ChainId, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetBidInput {
  bidId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getBid = ({ bidId, chainId, networkId, host }: IGetBidInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-sale.conventional-auction']['retrieve-bid'](
        bidId,
      ),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-sale.conventional-auction']['retrieve-bid']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
