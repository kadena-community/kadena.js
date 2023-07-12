import { Pact, signWithChainweaver } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

function main(): void {
  const sender =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  const receiver =
    'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
  const amount: IPactDecimal = { decimal: '0.23' };
  const signerAccount = sender.split('k:')[1];

  const transaction = Pact.builder
    .execute(
      Pact.modules.coin['transfer-create'](
        sender,
        receiver,
        "(read-keyset 'ks)",
        amount,
      ),
    )
    .addSigner(signerAccount, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    .addKeyset(
      'ks',
      'keys-all',
      '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
    )
    .setMeta({
      chainId: '1',
      gasLimit: 1000,
      gasPrice: 1.0e-6,
      sender: signerAccount,
      ttl: 10 * 60, // 10 minutes
    })
    .setNetworkId('testnet04')
    .createTransaction();

  signWithChainweaver(transaction) // sign
    .then((x) => console.log(JSON.stringify(x)))
    .catch(console.log);
}

main();
