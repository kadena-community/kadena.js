import { Pact } from '@kadena/client';

import { testnetChain1ApiHost } from './util/host';
import { Account } from './util/keyFromAccount';

async function getBalance(account: Account): Promise<void> {
  const res = await Pact.modules.coin['get-balance'](account).local(
    testnetChain1ApiHost,
  );
  console.log(res);
}

const myAccount: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';

getBalance(myAccount).catch(console.error);
