import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';
import type { IAuctionConfig } from './config';

interface IGetAuctionDetailsInput {
  auctionConfig: IAuctionConfig;
  saleId: string;
  chainId: ChainId;
}

const getAuctionDetailsCommand = ({
  auctionConfig,
  saleId,
  chainId,
}: IGetAuctionDetailsInput) =>
  composePactCommand(
    execution(
      auctionConfig.conventional
        ? Pact.modules['marmalade-sale.conventional-auction'][
            'retrieve-auction'
          ](saleId)
        : Pact.modules['marmalade-sale.dutch-auction']['retrieve-auction'](
            saleId,
          ),
    ),
    setMeta({
      chainId,
    }),
  );

export const getAuctionDetails = (
  inputs: IGetAuctionDetailsInput,
  config: IClientConfig,
) => {
  if (inputs.auctionConfig?.conventional)
    return dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-sale.conventional-auction']['retrieve-auction']
      >
    >(config)(getAuctionDetailsCommand(inputs));

  if (inputs.auctionConfig?.dutch)
    return dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-sale.dutch-auction']['retrieve-auction']
      >
    >(config)(getAuctionDetailsCommand(inputs));

  throw new Error('Invalid sale type');
};
