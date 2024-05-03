import type {
  BuiltInPredicate,
  IPactModules,
  PactReturnType,
} from '@kadena/client';
import { Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetAccountBalanceInput {
  tokenId: string;
  accountName: string;
  chainId: ChainId;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
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
      Pact.modules['marmalade-v2.ledger']['details'](tokenId, accountName),
    ),
    addSigner(guard.keyset.keys, (signFor) => [signFor('coin.GAS')]),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getAccountDetails = (
  inputs: IGetAccountBalanceInput,
  config: IClientConfig,
) =>
  submitClient<PactReturnType<IPactModules['marmalade-v2.ledger']['details']>>(
    config,
  )(getAccountDetailsCommand(inputs));
