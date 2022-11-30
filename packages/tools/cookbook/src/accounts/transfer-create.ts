import { Pact, signWithChainweaver } from '@kadena/client';
import { ISendResponse } from '@kadena/chainweb-node-client';
import { getAccountKey, apiHost, printLocal } from '../utils';

const HELP = `Usage example: \n\nnode transfer-create.js k:{senderPublicKey} k:{receiverPublicKey} amount`;
const NETWORK_ID = 'testnet04';
const API_HOST = apiHost('1', 'testnet.', NETWORK_ID);

if (process.argv.length !== 5) {
  console.info(HELP);
  process.exit(1);
}

const [sender, receiver, transferAmount] = process.argv.slice(2);
const amount = Number(transferAmount);

async function transferCreate(
  sender: string,
  receiver: string,
  amount: number,
): Promise<void> {
  const senderPublicKey = getAccountKey(sender);
  const guardData: Record<string, unknown> = {
    ks: {
      keys: [getAccountKey(receiver)],
      pred: 'keys-all',
    },
  };

  const transactionBuilder = await Pact.modules.coin['transfer-create'](
    sender,
    receiver,
    () => '(read-keyset "ks")',
    amount,
  )
    .addData(guardData)
    .addCap('coin.GAS', senderPublicKey)
    .addCap('coin.TRANSFER', senderPublicKey, sender, receiver, amount)
    .setMeta(
      {
        sender: senderPublicKey,
      },
      NETWORK_ID,
    );

  const signedTransactions = await signWithChainweaver(transactionBuilder);

  const sendRequests = signedTransactions.map((tx) => {
    console.log(`Sending transaction: ${tx.code}`);
    return tx.send(API_HOST);
  });

  const sendResponses = await Promise.all(sendRequests);

  sendResponses.map(async function startPolling(
    sendResponse: ISendResponse,
  ): Promise<void> {
    console.log('sendResponse', sendResponse);
    const requestKey = (await sendRequests[0]).requestKeys[0];
    console.log({ requestKey });
    // await pollMain(requestKey);
  });
}

transferCreate(sender, receiver, amount).catch(console.error);
