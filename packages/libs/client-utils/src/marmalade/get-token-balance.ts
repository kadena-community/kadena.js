import type { IPactModules, PactReturnType } from '@kadena/client';
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

interface IGeBalanceInput {
  tokenId: string;
  chainId: ChainId;
  accountName: string;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
}

const getTokenBalanceCommand = ({
  tokenId,
  chainId,
  accountName,
  guard,
}: IGeBalanceInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['get-balance'](tokenId, accountName),
    ),
    addKeyset('guard', 'keys-all', ...guard.keyset.keys),
    addSigner(guard.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-v2.ledger.get-balance', tokenId, accountName),
    ]),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getTokenBalance = (
  inputs: IGeBalanceInput,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['get-balance']>
  >(config)(getTokenBalanceCommand(inputs));
