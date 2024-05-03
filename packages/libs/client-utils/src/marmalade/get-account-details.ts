import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetAccountBalanceInput {
  tokenId: string;
  accountName: string;
  chainId: ChainId;
  guard: {
    account: string;
  };
}

const getAccountDetailsCommand = ({
  tokenId,
  accountName,
  chainId,
  guard,
}: IGetAccountBalanceInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].details(tokenId, accountName),
    ),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getAccountDetails = (
  inputs: IGetAccountBalanceInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['details']>
  >(config)(getAccountDetailsCommand(inputs));
