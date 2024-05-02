import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetEscrowInput {
  saleId: string;
  chainId: ChainId;
  guard: {
    account: string;
  };
}

const getEscrowAccountCommand = ({ saleId, chainId, guard }: IGetEscrowInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.policy-manager']['get-escrow-account'](saleId),
    ),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getEscrowAccount = (
  inputs: IGetEscrowInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-v2.policy-manager']['get-escrow-account']
    >
  >(config)(getEscrowAccountCommand(inputs));
