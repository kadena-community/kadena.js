import {
  getClient,
  isSignedCommand,
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
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sender.account,
        readKeyset('owner-guard'),
      ),
    )
    .addKeyset('owner-guard', 'keys-all', sender.publicKey)
    .addSigner(sender.publicKey)
    .setNetworkId('testnet04')
    .setMeta({ chainId: '0', sender: sender.account })
    .createTransaction();

  const signedTransaction = await signWithChainweaver(unsignedTransaction);

  if (isSignedCommand(signedTransaction)) {
    const { submit, listen } = getClient();
    const requestKey = await submit(signedTransaction);
    console.log('requestKey', requestKey);
    const response = await listen(requestKey);
    if (response.result.status === 'success') {
      console.log('success', response);
    }
    console.error('error', response);
    throw new Error('failure');
  }
}

const senderAccount: string =
  'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46';

createProject(`id:${Date.now()}`, 'An awesome project', {
  account: senderAccount,
  publicKey: keyFromAccount(senderAccount),
}).catch(console.error);
