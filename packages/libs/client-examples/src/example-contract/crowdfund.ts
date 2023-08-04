import {
  getClient,
  isSignedTransaction,
  literal,
  Pact,
  readKeyset,
  signWithChainweaver,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

import { keyFromAccount } from './util/keyFromAccount';

export async function createProject(
  id: string,
  name: string,
  sender: {
    publicKey: string;
    account: string;
  },
): Promise<void> {
  const unsignedTransaction = Pact.builder
    .execution(
      Pact.modules['free.crowdfund']['create-project'](
        id,
        name,
        literal('coin'),
        new PactNumber('1000').toPactDecimal(),
        new PactNumber('800').toPactDecimal(),
        new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sender.account,
        readKeyset('owner-guard'),
      ),
    )
    .addKeyset('owner-guard', 'keys-all', sender.publicKey)
    .addSigner(sender.publicKey)
    .setNetworkId('testnet04')
    .setMeta({ chainId: '0', senderAccount: sender.account })
    .createTransaction();

  const signedTransaction = await signWithChainweaver(unsignedTransaction);

  if (isSignedTransaction(signedTransaction)) {
    const { submit, listen } = getClient();
    const requestObject = await submit(signedTransaction);
    console.log('requestObject', requestObject);
    const response = await listen(requestObject);
    if (response.result.status === 'success') {
      console.log('success', response);
      return;
    }
    console.error('error', response);
    throw new Error('failure');
  }
}

const senderAccount: string =
  'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';

createProject(`id:${Date.now()}`, 'An awesome project', {
  account: senderAccount,
  publicKey: keyFromAccount(senderAccount),
}).catch(console.error);
