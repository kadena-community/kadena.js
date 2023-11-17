import type { ICommandResult } from '@kadena/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId } from '@kadena/types';
import { devnetConfig } from './config';
import type { IAccount } from './helper';
import {
  inspect,
  listen,
  logger,
  sender00,
  signAndAssertTransaction,
  stringifyProperty,
  submit,
} from './helper';

export async function safeTransfer({
  receiver,
  chainId = devnetConfig.CHAIN_ID,
  sender = sender00,
  amount = 100,
}: {
  receiver: IAccount;
  chainId?: ChainId;
  sender?: IAccount;
  amount?: number;
}): Promise<ICommandResult> {
  const extraAmount = new PactNumber('0.001').toPactDecimal();
  const pactAmount = new PactNumber(amount)
    .plus(extraAmount.decimal)
    .toPactDecimal();

  logger.info(
    `Safe Transfer from ${sender.account} to ${
      receiver.account
    }\nPublic Key: ${stringifyProperty(receiver.keys, 'publicKey')}\nAmount: ${
      pactAmount.decimal
    }`,
  );

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        receiver.account,
        () => '(read-keyset "ks")',
        pactAmount,
      ),
      Pact.modules.coin.transfer(receiver.account, sender.account, extraAmount),
    )
    .addData('ks', {
      keys: receiver.keys.map((key) => key.publicKey),
      pred: 'keys-all',
    })
    .addSigner(
      sender.keys.map((key) => key.publicKey),
      (withCap) => [
        withCap('coin.GAS'),
        withCap('coin.TRANSFER', sender.account, receiver.account, pactAmount),
      ],
    )
    .addSigner(
      receiver.keys.map((key) => key.publicKey),
      (withCap) => [
        withCap('coin.TRANSFER', receiver.account, sender.account, extraAmount),
      ],
    )
    .setMeta({
      gasLimit: 1500,
      chainId,
      senderAccount: sender.account,
      ttl: 8 * 60 * 60, //8 hours
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .createTransaction();

  const signedTx = signAndAssertTransaction([...sender.keys, ...receiver.keys])(
    transaction,
  );

  const transactionDescriptor = await submit(signedTx);
  inspect('Transfer Submited')(transactionDescriptor);

  const result = await listen(transactionDescriptor);
  inspect('Transfer Result')(result);
  if (result.result.status === 'failure') {
    throw result.result.error;
  } else {
    logger.info(result.result);
    return result;
  }
}
