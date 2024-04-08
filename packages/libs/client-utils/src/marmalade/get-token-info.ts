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

interface IGetTokenInfoInput {
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

const getTokenInfoCommand = ({ tokenId, chainId, guard }: IGetTokenInfoInput) =>
  composePactCommand(
    execution(Pact.modules['marmalade-v2.ledger']['get-token-info'](tokenId)),
    addSigner(guard.keyset.keys, (signFor) => [signFor('coin.GAS')]),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getTokenInfo = (
  inputs: IGetTokenInfoInput,
  config: IClientConfig,
) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['get-token-info']>
  >(config)(getTokenInfoCommand(inputs));
