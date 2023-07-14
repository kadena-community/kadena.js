import { isSignedCommand, Pact, signWithChainweaver } from '@kadena/client';

import { pollStatus, submit } from './util/client';

async function transactionMain(): Promise<void> {
  const senderAccount: string =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  const receiverAccount: string =
    'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
  const onlyKey = (s: string): string => s.split(':')[1];

  const amount: { decimal: string } = { decimal: '0.1337' };

  const tx = Pact.builder
    .execute(
      Pact.modules.coin.transfer(senderAccount, receiverAccount, amount),
      Pact.modules.coin.transfer(receiverAccount, senderAccount, {
        decimal: '0.000000000001',
      }),
      Pact.modules.coin.rotate('', () => ''),
    )
    .addSigner(onlyKey(senderAccount), (withCap) => [
      withCap('coin.TRANSFER', senderAccount, receiverAccount, amount),
      withCap('coin.GAS'),
    ])
    .setMeta({ chainId: '1', sender: senderAccount })
    .setNetworkId('testnet04')
    .createTransaction();

  console.log('unsigned transaction', JSON.stringify(tx));
  const tr = await signWithChainweaver(tx);

  if (isSignedCommand(tr)) {
    const requestKeys = await submit(tr);
    const result = await pollStatus(requestKeys);
    console.log(result);
  }
}

transactionMain().catch(console.error);
// pollMain('OXnoT0dDMQRKjrDDo4UHYr4u71Uo7Ry9Eb_1V9za6vM').catch(console.error);
// getBalanceMain().catch(console.error);
