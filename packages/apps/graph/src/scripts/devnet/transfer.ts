import {
  Pact,
  createSignWithKeypair,
  createTransaction,
  isSignedTransaction,
} from '@kadena/client';
import {
  addData,
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';

import config from './config';
import type { IAccount } from './helper';
import {
  assertTransactionSigned,
  asyncPipe,
  inspect,
  listen,
  sender00,
  signTransaction,
  submit,
} from './helper';

export async function transfer(
  publicKey: string,
  sender: IAccount = sender00,
  amount: number = 100,
) {
  const account = `k:${publicKey}`;
  const pactAmount = new PactNumber(amount).toPactDecimal().decimal;

  console.log(
    `Transfering from ${sender.account} to ${account}\nPublic Key: ${publicKey}\nAmount: ${pactAmount}`,
  );

  return asyncPipe(
    Pact.builder.execution(
      Pact.modules.coin['transfer-create'](
        sender.account,
        account,
        () => '(read-keyset "ks")',
        { decimal: pactAmount },
      ),
    ),
    setMeta({
      gasLimit: 1000,
      chainId: config.CHAIN_ID,
      senderAccount: sender.account,
    }),
    setNetworkId(config.NETWORK_ID),
    addData('ks', { keys: [publicKey], pred: 'keys-all' }),
    addSigner(sender.publicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('coin.TRANSFER', sender.account, account, amount),
    ]),
    createTransaction,
    signTransaction({
      publicKey: sender.publicKey,
      secretKey: sender.secretKey || '',
    }),
    assertTransactionSigned,
    submit,
    inspect('submit'),
    listen,
    inspect('fund result'),
  )(undefined);
}

// const transaction = Pact.builder
//   .execution(
//     Pact.modules.coin['transfer-create'](
//       sender.account,
//       account,
//       () => '(read-keyset "ks")',
//       { decimal: pactAmount },
//     ),
//   )
//   .addData('ks', { keys: [publicKey], pred: 'keys-all' })
//   .addSigner(sender.publicKey, (withCap) => [
//     withCap('coin.GAS'),
//     withCap('coin.TRANSFER', sender.account, account, {
//       decimal: pactAmount,
//     }),
//   ])
//   .setMeta({
//     gasLimit: 1000,
//     chainId: config.CHAIN_ID,
//     senderAccount: sender.account,
//   })
//   .setNetworkId(config.NETWORK_ID)
//   .createTransaction();

// // const signWithKeypair = createSignWithKeypair({
// //   publicKey: sender.publicKey,
// //   secretKey: sender.secretKey || '',
// // });

// // const signedTx = await signWithKeypair(transaction);

// const signedTx = await signTransaction({
//   publicKey: sender.publicKey,
//   secretKey: sender.secretKey || '',
// })(transaction);

// if (isSignedTransaction(signedTx)) {
//   const transactionDescriptor = await submit(signedTx);
//   inspect('Transfer Submit')(transactionDescriptor);

//   const result = await listen(transactionDescriptor);
//   inspect('Fund Result')(result);
//   if (result.result.status === 'failure') {
//     throw result.result.error;
//   } else {
//     console.log(result.result);
//   }
// }
