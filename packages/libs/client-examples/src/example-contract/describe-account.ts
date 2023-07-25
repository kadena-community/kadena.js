import { Pact } from '@kadena/client';

import { dirtyRead } from './util/client';

const account: string =
  'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46';

const NETWORK_ID: string = 'testnet04';

async function getDetail(): Promise<void> {
  const unsignedTransaction = Pact.builder
    .execution(Pact.modules.coin.details(account))
    .setMeta({ chainId: '0' })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const res = await dirtyRead(unsignedTransaction);
  console.log(res);
}

async function getBalanceMain(): Promise<void> {
  const tr = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId: '0' })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const res = await dirtyRead(tr);

  console.log(res);
}

getDetail().catch(console.error);
getBalanceMain().catch(console.error);
