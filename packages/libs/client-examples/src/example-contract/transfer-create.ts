import {
  isSignedTransaction,
  Pact,
  readKeyset,
  signWithChainweaver,
} from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

import { listen, preflight, submit } from './util/client';

const NETWORK_ID: string = 'testnet04';

async function main(): Promise<void> {
  const senderAccount =
    'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46';
  const receiverAccount =
    'k:1a98599ff4677a119565d852b29b0d447c5051cb2c49673c32cba3fae096e209';
  const amount: IPactDecimal = { decimal: '0.23' };
  const signerKey = senderAccount.split('k:')[1];
  const receiverKey = receiverAccount.split('k:')[1];

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        senderAccount,
        receiverAccount,
        readKeyset('ks'),
        amount,
      ),
    )
    .addSigner(signerKey, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', senderAccount, receiverAccount, amount),
    ])
    .addKeyset('ks', 'keys-all', receiverKey)
    .setMeta({
      chainId: '1',
      gasLimit: 1000,
      gasPrice: 1.0e-6,
      senderAccount,
      ttl: 10 * 60, // 10 minutes
    })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTx = await signWithChainweaver(transaction);

  const preflightResult = await preflight(signedTx);

  if (preflightResult.result.status === 'failure') {
    console.error(preflightResult.result.status);
    throw new Error('failure');
  }

  console.log('preflight successful');

  if (isSignedTransaction(signedTx)) {
    const transactionDescriptor = await submit(signedTx);
    const result = await listen(transactionDescriptor);
    console.log(result);
  }
}

main().catch(console.error);
