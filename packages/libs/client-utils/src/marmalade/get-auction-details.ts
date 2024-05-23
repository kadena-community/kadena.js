import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { ChainId, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import type { IAuctionConfig } from './config';

interface IGetAuctionDetailsInput {
  auctionConfig: IAuctionConfig;
  saleId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getAuctionDetails = async ({
  auctionConfig,
  saleId,
  chainId,
  host,
  networkId,
}: IGetAuctionDetailsInput) => {
  const config = {
    host,
    defaults: {
      networkId,
      meta: { chainId },
    },
  };

  if (auctionConfig?.conventional)
    return pipe(
      () =>
        Pact.modules['marmalade-sale.conventional-auction']['retrieve-auction'](
          saleId,
        ),
      execution,
      dirtyReadClient<
        PactReturnType<
          IPactModules['marmalade-sale.conventional-auction']['retrieve-auction']
        >
      >(config),
    )().execute();

  if (auctionConfig?.dutch)
    return pipe(
      () =>
        Pact.modules['marmalade-sale.dutch-auction']['retrieve-auction'](
          saleId,
        ),
      execution,
      dirtyReadClient<
        PactReturnType<
          IPactModules['marmalade-sale.dutch-auction']['retrieve-auction']
        >
      >(config),
    )().execute();

  throw new Error('Invalid sale type');
};
