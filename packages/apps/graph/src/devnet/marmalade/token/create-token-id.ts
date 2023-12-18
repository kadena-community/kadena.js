import { IAccount } from '@devnet/helper';
import { Pact, readKeyset } from '@kadena/client';
import { dirtyReadClient } from '@kadena/client-utils/core';
import {
  addKeyset,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { dotenv } from '@utils/dotenv';

interface ICreateTokenIdInput {
  policies?: string[];
  uri: string;
  precision?: number;
  sender: IAccount;
}

export async function createTokenId({
  policies = [],
  uri,
  precision = 0,
  sender,
}: ICreateTokenIdInput): Promise<string> {
  return (await dirtyReadClient({
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
  })(
    composePactCommand(
      execution(
        Pact.modules['marmalade-v2.ledger']['create-token-id'](
          { precision, uri, policies },
          readKeyset('creation-guard'),
        ),
      ),
      addKeyset(
        'creation-guard',
        'keys-all',
        ...sender.keys.map((key) => key.publicKey),
      ),
      setMeta({ senderAccount: sender.account, chainId: sender.chainId }),
    ),
  ).execute()) as string;
}
