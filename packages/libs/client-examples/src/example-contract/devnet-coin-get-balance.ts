import type { ChainId } from '@kadena/client';
import { createClient, Pact } from '@kadena/client';

const DEVNET_HOST: string = 'localhost:8080';
const NETWORK_ID: string = 'development';
const CHAIN_ID: string = '0';

async function getBalance(account: string): Promise<void> {
  const client = await createClient(
    `http://${DEVNET_HOST}/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`,
  );

  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({
      chainId: CHAIN_ID as ChainId,
    })
    .setNetworkId('development')
    .createTransaction();

  const result = client.local(transaction, { preflight: false });

  console.log(result);
}

const myAccount: string =
  'k:f90ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f';

getBalance(myAccount).catch(console.error);
