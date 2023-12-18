import { IAccount } from '@devnet/helper';
import {
  ICommandResult,
  Pact,
  PactReference,
  createSignWithKeypair,
  readKeyset,
} from '@kadena/client';
import { submitClient } from '@kadena/client-utils/core';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { dotenv } from '@utils/dotenv';

interface ICreateTokenInput {
  policies?: string[];
  uri: string;
  tokenId: string;
  precision?: number;
  sender: IAccount;
}

export async function createToken({
  policies = [],
  uri,
  tokenId,
  precision = 0,
  sender,
}: ICreateTokenInput): Promise<ICommandResult> {
  const command = composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['create-token'](
        tokenId,
        new PactNumber(precision).toPactInteger(),
        uri,
        policies.length > 0
          ? ([policies.join(' ')] as unknown as PactReference)
          : ([] as unknown as PactReference),
        readKeyset('creation-guard'),
      ),
    ),
    addKeyset(
      'creation-guard',
      'keys-all',
      ...sender.keys.map((key) => key.publicKey),
    ),
    addSigner(
      sender.keys.map((key) => key.publicKey),
      (signFor) => [
        signFor('coin.GAS'),
        signFor('marmalade-v2.ledger.CREATE-TOKEN', tokenId, {
          pred: 'keys-all',
          keys: sender.keys.map((key) => key.publicKey),
        }),
      ],
    ),
    setMeta({ senderAccount: sender.account, chainId: sender.chainId }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
    sign: createSignWithKeypair(sender.keys),
  };

  const result = await submitClient(config)(command).executeTo('listen');
  return result;
}
