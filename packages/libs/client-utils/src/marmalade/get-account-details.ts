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
}

const getAccountDetailsCommand = ({
  tokenId,
  accountName,
  chainId,
}: IGetAccountBalanceInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].details(tokenId, accountName),
    ),
    setMeta({
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
