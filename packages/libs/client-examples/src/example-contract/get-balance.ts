import { Pact } from '@kadena/client';

import { dirtyReady } from './util/client';
import { Account } from './util/keyFromAccount';

async function getBalance(account: Account): Promise<void> {
  const tr = Pact.builder
    .execute(Pact.modules.coin['get-balance'](account))
    .createTransaction();

  // we don't want to submit a transaction for just reading data,
  // so instead we just read the value from the local data of the blockchain node
  const res = await dirtyReady(tr);

  console.log(res);
}

const myAccount: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';

getBalance(myAccount).catch(console.error);
