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

interface IGetUriInput {
  tokenId: string;
  chainId: ChainId;
  guard: {
    account: string;
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
}

const getUriCommand = ({ tokenId, chainId, guard }: IGetUriInput) =>
  composePactCommand(
    execution(Pact.modules['marmalade-v2.ledger']['get-uri'](tokenId)),
    addSigner(guard.keyset.keys, (signFor) => [signFor('coin.GAS')]),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getUri = (inputs: IGetUriInput, config: IClientConfig) =>
  submitClient<PactReturnType<IPactModules['marmalade-v2.ledger']['get-uri']>>(
    config,
  )(getUriCommand(inputs));
