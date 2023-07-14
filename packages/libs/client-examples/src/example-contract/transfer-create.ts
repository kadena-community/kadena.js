import { isSignedCommand, Pact, signWithChainweaver } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

import { pollStatus, preflight, submit } from './util/client';

function onlyKey(account: string): string {
  return account.split(':')[1];
}

async function main(): Promise<void> {
  const sender: string =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  const receiver: string = 'k:somepublickey';
  const amount: IPactDecimal = { decimal: '1000.0' };

  const unsignedTransaction = Pact.builder
    .execute(
      Pact.modules.coin['transfer-create'](
        sender,
        receiver,
        () => '(read-keyset "ks")',
        amount,
      ),
    )
    .addKeyset('ks', 'keys-all', 'somepublickey')
    .addSigner(onlyKey(sender), (withCapability) => [
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    .setNetworkId('testnet04')
    .createTransaction();

  // simulate running the tr with preflight
  const localResponse = await preflight(unsignedTransaction);

  console.log('preflight response: ', JSON.stringify(localResponse, null, 2));

  const signedTr = await signWithChainweaver(unsignedTransaction);

  if (isSignedCommand(signedTr)) {
    const requestKey = await submit(signedTr);
    const result = await pollStatus(requestKey);
    console.log(result);
  }
}

main().catch(console.error);
