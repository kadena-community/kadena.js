import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { ChainId, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetCurrentPriceInput {
  saleId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getCurrentPrice = ({
  saleId,
  chainId,
  networkId,
  host,
}: IGetCurrentPriceInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-sale.dutch-auction']['get-current-price'](saleId),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-sale.dutch-auction']['get-current-price']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
