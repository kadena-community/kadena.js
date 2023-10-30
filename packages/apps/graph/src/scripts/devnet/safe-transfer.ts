import type { ICommandResult } from '@kadena/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { ChainId, IKeyPair } from '@kadena/types';
import { devnetConfig } from './config';
import type { IAccount } from './helper';
import {
  inspect,
  listen,
  logger,
  sender00,
  signAndAssertTransaction,
  submit,
} from './helper';

export async function safeTransfer({
  receiverKeyPair,
  chainId = devnetConfig.CHAIN_ID,
  sender = sender00,
  amount = 100,
}: {
  receiverKeyPair: IKeyPair;
  chainId?: ChainId;
  sender?: IAccount;
  amount?: number;
}): Promise<ICommandResult> {
  const fromAccount = `k:${receiverKeyPair.publicKey}`;
  const extraAmount = new PactNumber('0.001').toPactDecimal();
  const pactAmount = new PactNumber(amount)
    .plus(extraAmount.decimal)
    .toPactDecimal();

  logger.info(
    `Safe Transfer from ${sender.account} to ${fromAccount}\nPublic Key: ${receiverKeyPair.publicKey}\nAmount: ${pactAmount.decimal}`,
  );

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        fromAccount,
        () => '(read-keyset "ks")',
        pactAmount,
      ),
      Pact.modules.coin.transfer(fromAccount, sender.account, extraAmount),
    )
    .addData('ks', { keys: [receiverKeyPair.publicKey], pred: 'keys-all' })
    .addSigner(sender.publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', sender.account, fromAccount, pactAmount),
    ])
    .addSigner(receiverKeyPair.publicKey, (withCap) => [
      withCap('coin.TRANSFER', fromAccount, sender.account, extraAmount),
    ])
    .setMeta({
      gasLimit: 1500,
      chainId,
      senderAccount: sender.account,
      ttl: 8 * 60 * 60, //8 hours
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
    .createTransaction();

  const signedTx = signAndAssertTransaction([sender, receiverKeyPair])(
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
