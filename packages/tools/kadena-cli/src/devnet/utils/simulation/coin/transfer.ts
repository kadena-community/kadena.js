import type { ChainId, ICommandResult } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { transferCreate } from '@kadena/client-utils/coin';
import { PactNumber } from '@kadena/pactjs';

import type { IAccount } from '../../../../constants/devnets.js';
import { log } from '../../../../utils/logger.js';
import { stringifyProperty } from '../helper.js';

export async function transfer({
  network,
  receiver,
  chainId,
  sender,
  amount,
}: {
  network: { host: string; id: string };
  receiver: IAccount;
  chainId: ChainId;
  sender: IAccount;
  amount: number;
}): Promise<ICommandResult> {
  const pactAmount = new PactNumber(amount).toPactDecimal();

  log.info(
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
      host: network.host,
      defaults: {
        networkId: network.id,
      },
      sign: createSignWithKeypair(sender.keys),
    },
  ).executeTo('listen');
}
