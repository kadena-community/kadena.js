import type { IAccount } from '@devnet/utils';
import { Pact, createSignWithKeypair } from '@kadena/client';
import { submitClient } from '@kadena/client-utils/core';
import {
  addKeyset,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { dotenv } from '@utils/dotenv';

export const getDetails = async (
  tokenId: string,
  accountName: string,
  guard: IAccount,
): Promise<any> => {
  const command = composePactCommand(
    execution(
      Pact.modules['marmalade-v2.ledger']['get-balance'](tokenId, accountName),
    ),
    addKeyset('guard', 'keys-all', ...guard.keys.map((key) => key.publicKey)),
    addSigner(
      guard.keys.map((key) => key.publicKey),
      (signFor) => [
        signFor('coin.GAS'),
        signFor('marmalade-v2.ledger.get-balance', tokenId, accountName),
      ],
    ),
    setMeta({
      senderAccount: guard.account,
      chainId: dotenv.SIMULATE_DEFAULT_CHAIN_ID,
    }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
    sign: createSignWithKeypair(guard.keys),
  };

  const result = await submitClient(config)(command).executeTo('listen');
  return result;
};
