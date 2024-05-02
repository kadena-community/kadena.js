import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetCurrentPriceInput {
  saleId: string;
  chainId: ChainId;
  guard: {
    account: string;
  };
}

const getCurrentPriceCommand = ({
  saleId,
  chainId,
  guard,
}: IGetCurrentPriceInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-sale.dutch-auction']['get-current-price'](saleId),
    ),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getCurrentPrice = (
  inputs: IGetCurrentPriceInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-sale.dutch-auction']['get-current-price']
    >
  >(config)(getCurrentPriceCommand(inputs));
