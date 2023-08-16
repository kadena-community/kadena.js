import {
  getClient,
  isSignedTransaction,
  Pact,
  signWithChainweaver,
} from '@kadena/client';

import { accountKey } from '../utils/account-key';
import { apiHost } from '../utils/api-host';

const HELP: string = `Usage example: \n\nts-node create-account.js k:{gasProviderPublicKey} k:{receiverPublicKey}`;
const NETWORK_ID: 'testnet04' | 'mainnet01' | 'development' = 'testnet04';
const API_HOST: string = apiHost('1', 'testnet.', NETWORK_ID);

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

const [gasProvider, receiver] = process.argv.slice(2);

/**
 * Create a new KDA account
 *
 * @param gasProvider - Account paying for gas
 * @param receiver - Account being created
 * @return
 */
async function createAccount(
  gasProvider: string,
  receiver: string,
): Promise<void> {
  const gasProviderPublicKey = accountKey(gasProvider);

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['create-account'](receiver, () => '(read-keyset "ks")'),
    )
    .addData('ks', {
      keys: [accountKey(receiver)],
      pred: 'keys-all',
    })
    .addSigner(gasProviderPublicKey, (withCap: any) => [withCap('coin.GAS')])
    .setMeta({ chainId: '1', sender: gasProvider })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTransaction = await signWithChainweaver(transaction);

  if (!isSignedTransaction(signedTransaction)) {
    console.error('Command is not signed.');
    return;
  }

  const { submit, pollStatus } = getClient(API_HOST);

  const requestKey = await submit(signedTransaction);
  console.log('request key', requestKey);
  const result = await pollStatus(requestKey);
  console.log(result);
}

createAccount(gasProvider, receiver).catch(console.error);
