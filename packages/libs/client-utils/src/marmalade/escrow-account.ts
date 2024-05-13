import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IEscrowAccountInput {
  saleId: string;
  chainId: ChainId;
}

const escrowAccountCommand = ({ saleId, chainId }: IEscrowAccountInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-sale.conventional-auction']['escrow-account'](
        saleId,
      ),
    ),
    setMeta({
      chainId,
    }),
  );

export const escrowAccount = (
  inputs: IEscrowAccountInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-sale.conventional-auction']['escrow-account']
    >
  >(config)(escrowAccountCommand(inputs));
