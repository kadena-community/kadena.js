import { ISendResponse } from '@kadena/chainweb-node-client';
import { Pact, signWithChainweaver } from '@kadena/client';

import { accountKey, apiHost, pollTransactions } from '../utils';

const HELP: string = `Usage example: \n\nts-node create-account.js k:{gasProviderPublicKey} k:{receiverPublicKey}`;
const NETWORK_ID: 'testnet04' | 'mainnet01' | 'development' | undefined =
  'testnet04';
const API_HOST: string = apiHost('1', 'testnet.', NETWORK_ID);

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

const [gasProvider, receiver] = process.argv.slice(2);

async function transferCreate(
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

transferCreate(gasProvider, receiver).catch(console.error);
