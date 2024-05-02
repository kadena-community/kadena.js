import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IEscrowAccountInput {
  saleId: string;
  chainId: ChainId;
  guard: {
    account: string;
  };
}

const escrowAccountCommand = ({
  saleId,
  chainId,
  guard,
}: IEscrowAccountInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-sale.conventional-auction']['escrow-account'](
        saleId,
      ),
    ),
    setMeta({
      senderAccount: guard.account,
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
