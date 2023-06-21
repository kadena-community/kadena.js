import { PactCommand } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';

import { accountKey } from '../utils/account-key';
import { apiHost } from '../utils/api-host';

const HELP: string = `Usage example: \n\nts-node transfer-create.js k:{senderPublicKey} {senderPrivateKey} k:{receiverPublicKey} {amount}`;
const NETWORK_ID: 'testnet04' | 'mainnet01' | 'development' | undefined =
  'testnet04';
const API_HOST: string = apiHost('1', 'testnet.', NETWORK_ID);

if (process.argv.length !== 6) {
  console.info(HELP);
  process.exit(1);
}

const [sender, senderPrivateKey, receiver, transferAmount] =
  process.argv.slice(2);

/**
 * Create a new KDA account and transfer funds to it
 *
 * @param sender - Account sending coins
 * @param senderPrivateKey - Private key of the account sending the coins
 * @param receiver - Account being created and receiving coins
 * @param amount - Amount of coins transferred to the new account
 * @return
 */
async function transferCreate(
  sender: string,
  senderPrivateKey: string,
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

  const pactDecimal = { decimal: `${amount}` };

  const transactionBuilder = new PactCommand();
  transactionBuilder.code = `(coin.transfer "${sender}" "${receiver}" ${amount})`;
  transactionBuilder
    .addData(guardData)
    .addCap('coin.GAS', senderPublicKey)
    .addCap('coin.TRANSFER', senderPublicKey, sender, receiver, pactDecimal)
    .setMeta({ chainId: '1', sender }, NETWORK_ID);

  const cmd = transactionBuilder.createCommand();

  const sig = sign(cmd.cmd, {
    publicKey: senderPublicKey,
    secretKey: senderPrivateKey,
  });

  if (sig.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  transactionBuilder.addSignatures({ pubKey: senderPublicKey, sig: sig.sig });

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

transferCreate(
  sender,
  senderPrivateKey,
  receiver,
  Number(transferAmount),
).catch(console.error);
