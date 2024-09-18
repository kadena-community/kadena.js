import { inspect, transaction } from './tx.framework';

const code = (...codes: string[]) => codes.join('\n');

transaction('id:1', 'start cross chain', ({ env, deploy }) => ({
  payload: {
    exec: {
      code: code(
        `(define-namespace ${env('kip')} (sig-keyset) (sig-keyset))`,
        deploy('./path-to-pact-file.pact'),
      ),
      data: {
        ns: env('kip'),
        upgrade: false,
      },
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
