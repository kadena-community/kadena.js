import type { IAccount } from '@devnet/utils';
import type { ICommandResult, PactReference } from '@kadena/client';
import { Pact, createSignWithKeypair, readKeyset } from '@kadena/client';
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
import { networkData } from '@utils/network';

interface ICreateTokenInput {
  policies?: string[];
  uri: string;
  tokenId: string;
  precision?: number;
  creator: IAccount;
}

export async function createToken({
  policies = [],
  uri,
  tokenId,
  precision = 0,
  creator,
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
      ...creator.keys.map((key) => key.publicKey),
    ),
    addSigner(
      creator.keys.map((key) => key.publicKey),
      (signFor) => [
        signFor('coin.GAS'),
        signFor('marmalade-v2.ledger.CREATE-TOKEN', tokenId, {
          pred: 'keys-all',
          keys: creator.keys.map((key) => key.publicKey),
        }),
      ],
    ),
    setMeta({ senderAccount: creator.account, chainId: creator.chainId }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: networkData.networkId,
    },
    sign: createSignWithKeypair(creator.keys),
  };

  const result = await submitClient(config)(command).executeTo('listen');
  return result;
}
