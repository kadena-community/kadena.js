import { ChainId, Pact, readKeyset } from '@kadena/client';
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
  networkId: string;
  host: IClientConfig['host'];
}

export async function createTokenId({
  policies = [],
  uri,
  precision,
  creator,
  host,
  networkId,
  chainId,
}: ICreateTokenIdInput): Promise<string> {
  return (await dirtyReadClient({
    host,
    defaults: {
      networkId,
    },
  })(
    composePactCommand(
      execution(
        Pact.modules['marmalade-v2.ledger']['create-token-id'](
          { precision, uri, policies },
          readKeyset('creation-guard'),
        ),
      ),
      addKeyset('creation-guard', creator.keyset.pred, ...creator.keyset.keys),
      setMeta({ senderAccount: creator.account, chainId }),
    ),
  ).execute()) as string;
}
