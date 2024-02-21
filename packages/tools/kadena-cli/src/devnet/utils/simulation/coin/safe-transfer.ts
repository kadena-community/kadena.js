import type { ICommandResult } from '@kadena/client';
import { Pact, createSignWithKeypair } from '@kadena/client';
import { submitClient } from '@kadena/client-utils/core';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId } from '@kadena/types';
import type { IAccount } from '../../../../constants/devnets.js';
import { log } from '../../../../utils/logger.js';
import { stringifyProperty } from '../helper.js';

export async function safeTransfer({
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
  const extraAmount = new PactNumber('0.00000001').toPactDecimal();
  const pactAmount = new PactNumber(amount)
    .plus(extraAmount.decimal)
    .toPactDecimal();

  log.info(
    `Safe Transfer from ${sender.account} to ${
      receiver.account
    }\nPublic Key: ${stringifyProperty(receiver.keys, 'publicKey')}\nAmount: ${
      pactAmount.decimal
    }`,
  );

  return submitClient({
    host: network.host,
    sign: createSignWithKeypair([...sender.keys, ...receiver.keys]),
    defaults: {
      networkId: network.id,
    },
  })(
    Pact.builder
      .execution(
        Pact.modules.coin['transfer-create'](
          sender.account,
          receiver.account,
          () => '(read-keyset "ks")',
          pactAmount,
        ),
        Pact.modules.coin.transfer(
          receiver.account,
          sender.account,
          extraAmount,
        ),
      )
      .addData('ks', {
        keys: receiver.keys.map((key) => key.publicKey),
        pred: 'keys-all',
      })
      .addSigner(
        sender.keys.map((key) => key.publicKey),
        (withCap) => [
          withCap('coin.GAS'),
          withCap(
            'coin.TRANSFER',
            sender.account,
            receiver.account,
            pactAmount,
          ),
        ],
      )
      .addSigner(
        receiver.keys.map((key) => key.publicKey),
        (withCap) => [
          withCap(
            'coin.TRANSFER',
            receiver.account,
            sender.account,
            extraAmount,
          ),
        ],
      )
      .setMeta({
        gasLimit: 1500,
        chainId,
        senderAccount: sender.account,
        ttl: 8 * 60 * 60, //8 hours
      })
      .setNetworkId(network.id)
      .getCommand(),
  ).executeTo('listen');
}
