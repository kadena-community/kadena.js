import { Pact, signWithChainweaver } from '@kadena/client';

import { accountKey } from '../utils/account-key';
import { apiHost } from '../utils/api-host';

const HELP: string = `Usage example: \n\nts-node transfer-create.js k:{senderPublicKey} k:{receiverPublicKey} amount`;
const NETWORK_ID: 'testnet04' | 'mainnet01' | 'development' | undefined =
  'testnet04';
const API_HOST: string = apiHost('1', 'testnet.', NETWORK_ID);

if (process.argv.length !== 5) {
  console.info(HELP);
  process.exit(1);
}

const [sender, receiver, transferAmount] = process.argv.slice(2);

/**
 * Create a new KDA account and transfer funds to it
 *
 * @param sender - Account sending coins
 * @param receiver - Account being created and receiving coins
 * @param amount - Amount of coins transferred to the new account
 * @return
 */
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

  await signWithChainweaver(transactionBuilder);

  await transactionBuilder.send(API_HOST);
  const pollResult = await transactionBuilder.pollUntil(API_HOST, {
    onPoll: async (transaction, pollRequest): Promise<void> => {
      console.log(
        `Polling ${transaction.requestKey}.\nStatus: ${transaction.status}`,
      );
      console.log(await pollRequest);
    },
  });

  console.log('Polling Completed.');
  console.log(pollResult);
}

transferCreate(sender, receiver, Number(transferAmount)).catch(console.error);
