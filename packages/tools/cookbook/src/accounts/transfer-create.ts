import { Pact, signWithChainweaver } from '@kadena/client';
import { ISendResponse } from '@kadena/chainweb-node-client';
import { accountKey, apiHost, pollTransactions } from '../utils';

const HELP = `Usage example: \n\nts-node transfer-create.js k:{senderPublicKey} k:{receiverPublicKey} amount`;
const NETWORK_ID = 'testnet04';
const API_HOST = apiHost('1', 'testnet.', NETWORK_ID);

if (process.argv.length !== 5) {
  console.info(HELP);
  process.exit(1);
}

const [sender, receiver, transferAmount] = process.argv.slice(2);

async function transferCreate(
  sender: string,
  receiver: string,
  amount: number,
): Promise<void> {
  const senderPublicKey = accountKey(sender);
  const guardData: Record<string, unknown> = {
    ks: {
      keys: [accountKey(receiver)],
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
    .setMeta({ sender }, NETWORK_ID);

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

transferCreate(sender, receiver, Number(transferAmount)).catch(console.error);
