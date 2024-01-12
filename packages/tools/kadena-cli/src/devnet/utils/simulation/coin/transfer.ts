import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import { PactNumber } from '@kadena/pactjs';
import { SIMULATION_CONFIG } from '../config.js';
import { stringifyProperty } from '../helper.js';
import { IAccount, sender00 } from '../utils.js';

export async function transfer({
  receiver,
  chainId = SIMULATION_CONFIG.DEFAULT_CHAIN_ID,
  sender = sender00,
  amount = 100,
}: {
  receiver: IAccount;
  chainId?: ChainId;
  sender?: IAccount;
  amount?: number;
}): Promise<ICommandResult> {
  const pactAmount = new PactNumber(amount).toPactDecimal();

  console.log(
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
      host: SIMULATION_CONFIG.NETWORK_HOST,
      defaults: {
        networkId: SIMULATION_CONFIG.NETWORK_ID,
      },
      sign: createSignWithKeypair(sender.keys),
    },
  ).executeTo('listen');
}
