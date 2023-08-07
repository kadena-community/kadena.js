import {
  getClient,
  isSignedTransaction,
  Pact,
  signWithChainweaver,
} from '@kadena/client';
import { IPactDecimal } from '@kadena/types';

import { accountKey } from '../utils/account-key';
import { apiHost } from '../utils/api-host';

const HELP: string = `Usage example: \n\nts-node transfer-create-with-chainweaver.ts k:{senderPublicKey} k:{receiverPublicKey} {amount}`;
const NETWORK_ID: 'testnet04' | 'mainnet01' | 'development' = 'testnet04';
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
  const pactDecimal: IPactDecimal = { decimal: `${amount}` };

  const { submit, pollStatus } = getClient(API_HOST);

  const transaction = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        sender,
        receiver,
        () => '(read-keyset "ks")',
        pactDecimal,
      ),
    )
    .addData('ks', {
      keys: [accountKey(receiver)],
      pred: 'keys-all',
    })
    .addSigner(senderPublicKey, (withCap: any) => [
      withCap('coin.TRANSFER', sender, receiver, pactDecimal),
      withCap('coin.GAS'),
    ])
    .setMeta({ chainId: '1', sender: sender })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  const signedTransaction = await signWithChainweaver(transaction);

  if (!isSignedTransaction(signedTransaction)) {
    console.error('Command is not signed.');
    return;
  }

  const requestKey = await submit(signedTransaction);
  console.log('request key', requestKey);
  const result = await pollStatus(requestKey);
  console.log(result);
}

transferCreate(sender, receiver, Number(transferAmount)).catch(console.error);
