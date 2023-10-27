import {
  addSignatures,
  createClient,
  isSignedTransaction,
  Pact,
} from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { accountKey } from '../utils/account-key';
import { apiHost } from '../utils/api-host';

const HELP: string = `Usage example: \n\nts-node transfer-create.js k:{senderPublicKey} {senderPrivateKey} k:{receiverPublicKey} {amount}`;
const NETWORK_ID: 'testnet04' | 'mainnet01' | 'development' = 'testnet04';
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
 * @param senderAccount - Account sending coins
 * @param senderPrivateKey - Private key of the account sending the coins
 * @param receiver - Account being created and receiving coins
 * @param amount - Amount of coins transferred to the new account
 * @return
 */
async function transferCreate(
  senderAccount: string,
  senderPrivateKey: string,
  receiver: string,
  amount: number,
): Promise<void> {
  const senderPublicKey = accountKey(sender);
  const pactDecimal = { decimal: `${amount}` };

  const transaction = Pact.builder
    .execution(Pact.modules.coin.transfer(sender, receiver, pactDecimal))
    .addData('ks', {
      keys: [accountKey(receiver)],
      pred: 'keys-all',
    })
    .addSigner(senderPublicKey, (withCap) => [
      withCap('coin.TRANSFER', sender, receiver, pactDecimal),
      withCap('coin.GAS'),
    ])
    .setMeta({ chainId: '1', senderAccount })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const sig = sign(transaction.cmd, {
    publicKey: senderPublicKey,
    secretKey: senderPrivateKey,
  });

  if (sig.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  addSignatures(transaction, {
    sig: sig.sig,
    pubKey: sig.pubKey,
  });

  const { submit, pollStatus } = createClient(API_HOST);

  if (!isSignedTransaction(transaction)) {
    throw new Error('Command was not signed.');
  }

  const requestKey = await submit(transaction);
  const result = await pollStatus(requestKey);

  console.log('Polling Completed.');
  console.log(result);
}

transferCreate(
  sender,
  senderPrivateKey,
  receiver,
  Number(transferAmount),
).catch(console.error);
