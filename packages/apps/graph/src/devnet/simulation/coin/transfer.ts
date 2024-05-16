import type { IAccount } from '@devnet/utils';
import { sender00 } from '@devnet/utils';
import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import { PactNumber } from '@kadena/pactjs';
import { dotenv } from '@utils/dotenv';
import { logger } from '@utils/logger';
import { networkData } from '@utils/network';
import { stringifyProperty } from '../helper';

export async function transfer({
  receiver,
  chainId = dotenv.SIMULATE_DEFAULT_CHAIN_ID,
  sender = sender00,
  amount = 100,
}: {
  receiver: IAccount;
  chainId?: ChainId;
  sender?: IAccount;
  amount?: number;
}): Promise<ICommandResult> {
  const pactAmount = new PactNumber(amount).toPactDecimal();

  logger.info(
    `Transfering from ${sender.account} to ${
      receiver.account
    }\nPublic Key: ${stringifyProperty(receiver.keys, 'publicKey')}\nAmount: ${
      pactAmount.decimal
    }`,
  );

  return transferCreate(
    {
      amount: pactAmount.decimal,
      chainId,
      receiver: {
        account: receiver.account,
        keyset: {
          keys: receiver.keys.map((key) => key.publicKey),
          pred: 'keys-all',
        },
      },
      sender: {
        account: sender.account,
        publicKeys: sender.keys.map((key) => key.publicKey),
      },
    },
    {
      host: dotenv.NETWORK_HOST,
      defaults: {
        networkId: networkData.networkId,
      },
      sign: createSignWithKeypair(sender.keys),
    },
  ).executeTo('listen');
}
