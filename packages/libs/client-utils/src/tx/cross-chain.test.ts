import { inspect, transaction } from './tx.framework';

transaction('id:1', 'starting cross chain', ({ env }) => ({
  payload: {
    exec: {
      code: `(coin.transfer-cross-chain ${env('sender-account')} ${env('receiver-account')} ${env('amount')})`,
    },
  },
  signers: [
    {
      pubKey: env('sender-pub-key'),
      clist: [
        {
          name: 'coin.TRANSFER',
          args: [env('sender-account'), env('receiver-account'), env('amount')],
        },
      ],
    },
  ],
}));

transaction('id:2', 'finish cross chain', ({ resultOf, env, spvProof }) => ({
  payload: {
    cont: {
      pactId: resultOf('id:1').result.data.pactId,
      proof: spvProof('id:1'),
    },
  },
}));

inspect('inspect:1', async ({ resultOf, read, env }) => {
  const senderBalance = await read(
    `(coin.get-balance ${env('sender-account')})`,
  );
  const receiverBalance = await read(
    `(coin.get-balance ${env('receiver-account')})`,
  );
  console.log('sender balance', senderBalance);
  console.log('receiver balance', receiverBalance);
  console.log('result of 1', resultOf('id:1'));
  console.log('result of 2', resultOf('id:2'));
});
