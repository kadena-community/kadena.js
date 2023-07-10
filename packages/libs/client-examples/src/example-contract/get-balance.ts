import { Pact } from '@kadena/client';

import { local } from './util/client';
import { Account } from './util/keyFromAccount';

async function getBalance(account: Account): Promise<void> {
  const tr = Pact.builder
    .execute(Pact.modules.coin['get-balance'](account))
    .createTransaction();

  const res = await local(tr);

  console.log(res);
}

const myAccount: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';

getBalance(myAccount).catch(console.error);
