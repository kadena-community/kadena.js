import { Pact, signWithChainweaver } from '@kadena/client';

function main(): void {
  const sender =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  const receiver =
    'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
  const amount = 0.23;
  const signerAccount = sender.split('k:')[1];

  const transaction = Pact.modules.coin['transfer-create'](
    sender,
    receiver,
    () => "(read-keyset 'ks)",
    amount,
  )
    .addCap('coin.GAS', signerAccount)
    .addCap('coin.TRANSFER', signerAccount, sender, receiver, amount)
    .addData({
      ks: {
        keys: [
          '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
        ],
        pred: 'keys-all',
      },
    })
    .setMeta(
      {
        gasLimit: 1000,
        gasPrice: 1.0e-6,
        sender: signerAccount,
        ttl: 10 * 60, // 10 minutes
      },
      'testnet04',
    );

  signWithChainweaver(transaction) // sign
    .then((x) => console.log(JSON.stringify(x)))
    .catch(console.log);
}

main();
