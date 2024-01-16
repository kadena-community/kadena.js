import {
  ChainId,
  IPactModules,
  Pact,
  PactReturnType,
  readKeyset,
} from '@kadena/client';
import {
  addKeyset,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { dirtyReadClient } from '../core/client-helpers';
import { IClientConfig } from '../core/utils/helpers';

interface ICreateTokenIdInput {
  policies?: string[];
  uri: string;
  precision: number;
  chainId: ChainId;
  creator: {
    account: string;
    keyset: {
      keys: string[];
      pred: 'keys-all' | 'keys-2' | 'keys-any';
    };
  };
}

export const createTokenIdCommand = ({
  policies = [],
  uri,
  precision,
  creator,
  chainId,
}: ICreateTokenIdInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['create-token-id'](
        { precision, uri, policies },
        readKeyset('creation-guard'),
      ),
    ),
    addKeyset('creation-guard', creator.keyset.pred, ...creator.keyset.keys),
    setMeta({ senderAccount: creator.account, chainId }),
  );

export const createTokenId = (
  inputs: ICreateTokenIdInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['create-token-id']>
  >(config)(createTokenIdCommand(inputs));
