import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateBidIdInput {
  saleId: string;
  bidderAccount: string;
  chainId: ChainId;
}

const createBidIdCommand = ({
  saleId,
  bidderAccount,
  chainId,
}: ICreateBidIdInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-sale.conventional-auction']['create-bid-id'](
        saleId,
        bidderAccount,
      ),
    ),
    setMeta({ chainId }),
  );

export const createBidId = (
  inputs: ICreateBidIdInput,
  config: Omit<IClientConfig, 'sign'>,
) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-sale.conventional-auction']['create-bid-id']
    >
  >(config)(createBidIdCommand(inputs));
