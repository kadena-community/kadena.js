import { Pact } from '@kadena/client';

import { dirtyRead } from './util/client';

async function getDetail(): Promise<void> {
  const senderAccount: string =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';

  const unsignedTransaction = Pact.builder
    .execution(Pact.modules.coin.details(senderAccount))
    .createTransaction();

  const res = await dirtyRead(unsignedTransaction);
  console.log(res);
}

async function getBalanceMain(): Promise<void> {
  const tr = Pact.builder
    .execution(
      Pact.modules.coin['get-balance'](
        'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
      ),
    )
    .setMeta({ sender: '', chainId: '10' })
    .setNetworkId('mainnet04')
    .createTransaction();

  const res = await dirtyRead(tr);

  console.log(res);
}

getDetail().catch(console.error);
getBalanceMain().catch(console.error);
