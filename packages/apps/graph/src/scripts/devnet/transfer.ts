import type { ChainId, ICommandResult } from '@kadena/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

import config from './config';
import type { IAccount } from './helper';
import {
  assertTransactionSigned,
  inspect,
  listen,
  sender00,
  signAndAssertTransaction,
  submit,
} from './helper';

export async function transfer({
  publicKey,
  chainId = config.CHAIN_ID,
  sender = sender00,
  amount = 100,
}: {
  publicKey: string;
  chainId?: ChainId;
  sender?: IAccount;
  amount?: number;
}): Promise<ICommandResult> {
  const account = `k:${publicKey}`;
  const pactAmount = new PactNumber(amount).toPactDecimal();

  console.log(
    `Transfering from ${sender.account} to ${account}\nPublic Key: ${publicKey}\nAmount: ${pactAmount.decimal}`,
  );

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        account,
        () => '(read-keyset "ks")',
        pactAmount,
      ),
    )
    .addData('ks', { keys: [publicKey], pred: 'keys-all' })
    .addSigner(sender.publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', sender.account, account, pactAmount),
    ])
    .setMeta({
      gasLimit: 1000,
      chainId,
      senderAccount: sender.account,
    })
    .setNetworkId(config.NETWORK_ID)
    .createTransaction();

  const signedTx = signAndAssertTransaction(sender)(transaction);

  const confirmedSignedTx = assertTransactionSigned(signedTx);

  const transactionDescriptor = await submit(confirmedSignedTx);
  inspect('Transfer Submited')(transactionDescriptor);

  const result = await listen(transactionDescriptor);
  inspect('Transfer Result')(result);
  if (result.result.status === 'failure') {
    throw result.result.error;
  } else {
    console.log(result.result);
    return result;
  }
}
