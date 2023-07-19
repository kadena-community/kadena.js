import {
  createWalletConnectSign,
  getClient,
  isSignedCommand,
  literal,
  Pact,
  readKeyset,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export async function createProject(): Promise<void> {
  const publicKey = '';
  const account = `k:${publicKey}`;

  const unsignedTransaction = Pact.builder
    .execution(
      Pact.modules['free.crowdfund']['create-project'](
        'id',
        'an awsome project',
        literal('coin'),
        new PactNumber('1000').toPactDecimal(),
        new PactNumber('800').toPactDecimal(),
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        account,
        readKeyset('owner-guard'),
      ),
    )
    .addKeyset('owner-guard', 'keys-all', publicKey)
    .addSigner(publicKey)
    .setNetworkId('testnet04')
    .setMeta({ chainId: '0' })
    .createTransaction();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walletConnectChainId: any = null;

  const signWithWalletConnect = createWalletConnectSign(
    client,
    session,
    walletConnectChainId,
  );

  const signedTransaction = await signWithWalletConnect(unsignedTransaction);

  if (isSignedCommand(signedTransaction)) {
    const { submit, listen } = getClient();
    const requestKey = await submit(signedTransaction);
    const response = await listen(requestKey);
    if (response.result.status === 'success') {
      console.log('success', response);
    }
    throw new Error('failure');
  }
}
