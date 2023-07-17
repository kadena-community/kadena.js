import { ISendResponse } from '@kadena/chainweb-node-client';
import { Pact, signWithChainweaver } from '@kadena/client';

import { accountKey } from '../utils/account-key';
import { apiHost } from '../utils/api-host';
// eslint-disable-next-line import/no-unresolved -- TODO FILE NOT FOUND
import { pollTransactions } from '../utils/poll-transactions';

const HELP: string = `Usage example: \n\nts-node create-account.js k:{gasProviderPublicKey} k:{receiverPublicKey}`;
const NETWORK_ID: 'testnet04' | 'mainnet01' | 'development' | undefined =
  'testnet04';
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
  const guardData: Record<string, unknown> = {
    ks: {
      keys: [accountKey(receiver)],
      pred: 'keys-all',
    },
  };

  const transactionBuilder = await Pact.modules.coin['create-account'](
    receiver,
    () => '(read-keyset "ks")',
  )
    .addData(guardData)
    .addCap('coin.GAS', gasProviderPublicKey)
    .setMeta({ sender: gasProvider }, NETWORK_ID);

  const signedTransactions = await signWithChainweaver(transactionBuilder);

  const sendRequests = signedTransactions.map((tx) => {
    console.log(`Sending transaction: ${tx.code}`);
    return tx.send(API_HOST);
  });

  const sendResponses = await Promise.all(sendRequests);

  sendResponses.map(async function startPolling(
    sendResponse: ISendResponse,
  ): Promise<void> {
    console.log('Send response: ', sendResponse);
    const requestKey = (await sendRequests[0]).requestKeys[0];
    await pollTransactions([requestKey], API_HOST);
  });
}

createAccount(gasProvider, receiver).catch(console.error);
