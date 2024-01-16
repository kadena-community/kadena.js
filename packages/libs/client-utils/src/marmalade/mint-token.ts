import { IPactModules, Pact, PactReturnType, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { ChainId, IPactDecimal } from '@kadena/types';
import { submitClient } from '../core';
import { IClientConfig } from '../core/utils/helpers';

export interface IMintTokenInput {
  tokenId: string;
  creatorAccount: string;
  chainId: ChainId;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
  amount: IPactDecimal;
}

export const mintTokenCommand = ({
  tokenId,
  creatorAccount,
  chainId,
  guard,
  amount,
}: IMintTokenInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger'].mint(
        tokenId,
        creatorAccount,
        readKeyset('guard'),
        amount,
      ),
    ),
    addKeyset('guard', guard.keyset.pred, ...guard.keyset.keys),
    addSigner(guard.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-v2.ledger.MINT', tokenId, creatorAccount, amount),
    ]),
    setMeta({ senderAccount: guard.account, chainId }),
  );

export const mintToken = (inputs: IMintTokenInput, config: IClientConfig) =>
  submitClient<PactReturnType<IPactModules['marmalade-v2.ledger']['mint']>>(
    config,
  )(mintTokenCommand(inputs));
