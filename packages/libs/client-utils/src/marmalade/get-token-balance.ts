import type {
  BuiltInPredicate,
  IPactModules,
  PactReturnType,
} from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetBalanceInput {
  tokenId: string;
  chainId: ChainId;
  accountName: string;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
}

const getTokenBalanceCommand = ({
  tokenId,
  chainId,
  accountName,
  guard,
}: IGetBalanceInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['get-balance'](tokenId, accountName),
    ),
    addKeyset('guard', 'keys-all', ...guard.keyset.keys),
    addSigner(guard.keyset.keys, (signFor) => [signFor('coin.GAS')]),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getTokenBalance = (
  inputs: IGetBalanceInput,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['get-balance']>
  >(config)(getTokenBalanceCommand(inputs));