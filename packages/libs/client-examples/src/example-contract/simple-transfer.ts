import type { PactReturnType } from '@kadena/client';
import { isSignedTransaction, Pact, signWithChainweaver } from '@kadena/client';
import type { IPactDecimal } from '@kadena/types';
import { pollOne, submit } from './util/client';
import { keyFromAccount } from './util/keyFromAccount';

// npx ts-node simple-transfer.ts

// change these two accounts with your accounts
const senderAccount: string =
  'k:2f48080efe54e6eb670487f664bcaac7684b4ebfcfc8a3330ef080c9c97f7e11';
const receiverAccount: string =
  'k:6c63dda2d4b2b6d1d10537484d7279619283371b3ba62957a773676369944b17';

const NETWORK_ID: string = 'testnet04';

type TransferReturnType = PactReturnType<typeof Pact.modules.coin.transfer>;

async function transfer(
  sender: string,
  receiver: string,
  amount: IPactDecimal,
): Promise<TransferReturnType> {
  const transaction = Pact.builder
    .execution(Pact.modules.coin.transfer(sender, receiver, amount))
    .addSigner(keyFromAccount(sender), (signFor) => [
      signFor('coin.GAS'),
      signFor('coin.TRANSFER', sender, receiver, amount),
    ])
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId(NETWORK_ID)
    .createTransaction();

  console.log('transaction', JSON.parse(transaction.cmd));

  const signedTr = await signWithChainweaver(transaction);
  console.log('transation.sigs', JSON.stringify(signedTr.sigs, null, 2));

  if (isSignedTransaction(signedTr)) {
    const transactionDescriptor = await submit(signedTr);
    const response = await pollOne(transactionDescriptor, {
      confirmationDepth: 2,
      timeout: 5 * 60 * 1000, // 5 minutes
      onPoll: (id) =>
        console.log('time', new Date().toTimeString(), 'polling', id),
    });
    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      console.log(response.result);
      return response.result.data as TransferReturnType;
    }
  }
  throw new Error('Transaction not signed');
}

transfer(senderAccount, receiverAccount, { decimal: '1' }).catch(console.error);
