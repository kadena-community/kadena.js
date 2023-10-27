import { isSignedTransaction, Pact, signWithChainweaver } from '@kadena/client';
import type { IPactDecimal } from '@kadena/types';
import { listen, submit } from './util/client';
import { keyFromAccount } from './util/keyFromAccount';

// npx ts-node simple-transfer.ts

// change these two accounts with your accounts
const senderAccount: string =
  'k:dc20ab800b0420be9b1075c97e80b104b073b0405b5e2b78afd29dd74aaf5e46';
const receiverAccount: string =
  'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';

const NETWORK_ID: string = 'testnet04';

async function transfer(
  sender: string,
  receiver: string,
  amount: IPactDecimal,
): Promise<void> {
  const transaction = Pact.builder
    .execution(Pact.modules.coin.transfer(sender, receiver, amount))
    .addSigner(keyFromAccount(sender), (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  console.log('transaction', JSON.parse(transaction.cmd));

  const signedTr = await signWithChainweaver(transaction);
  console.log('transation.sigs', JSON.stringify(signedTr.sigs, null, 2));

  if (isSignedTransaction(signedTr)) {
    const transactionDescriptor = await submit(signedTr);
    const response = await listen(transactionDescriptor);
    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      console.log(response.result);
    }
  }
}

transfer(senderAccount, receiverAccount, { decimal: '1' }).catch(console.error);
