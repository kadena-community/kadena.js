import { Pact } from '@kadena/client';
import { dirtyRead } from './util/client';
import type { Account } from './util/keyFromAccount';

const NETWORK_ID: string = 'testnet04';

async function getBalance(account: Account): Promise<void> {
  const tr = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId: '0' })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  // we don't want to submit a transaction for just reading data,
  // so instead we just read the value from the local data of the blockchain node
  const res = await dirtyRead(tr);

  console.log(res);
}

const myAccount: string =
  'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46';

getBalance(myAccount).catch(console.error);
