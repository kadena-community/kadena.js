import type {
  ChainId,
  IPactModules,
  PactReference,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { IPactInt, PactValue } from '@kadena/types';
import { submitClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateTokenInput {
  policies?: string[];
  uri: string;
  tokenId: string;
  precision: IPactInt | PactReference;
  chainId: ChainId;
  creator: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
}

const createTokenCommand = ({
  policies = [],
  uri,
  tokenId,
  precision,
  creator,
  chainId,
}: ICreateTokenInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['create-token'](
        tokenId,
        precision,
        uri,
        policies.length > 0
          ? ([policies.join(' ')] as unknown as PactReference)
          : ([] as unknown as PactReference),
        readKeyset('creation-guard'),
      ),
    ),
    addKeyset('creation-guard', creator.keyset.pred, ...creator.keyset.keys),
    addSigner(creator.keyset.keys, (signFor) => [
      signFor('coin.GAS'),
      signFor('marmalade-v2.ledger.CREATE-TOKEN', tokenId, {
        pred: creator.keyset.pred,
        keys: creator.keyset.keys,
      }),
    ]),
    setMeta({ senderAccount: creator.account, chainId }),
  );

export const createToken = (inputs: ICreateTokenInput, config: IClientConfig) =>
  submitClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['create-token']>
  >(config)(createTokenCommand(inputs));
