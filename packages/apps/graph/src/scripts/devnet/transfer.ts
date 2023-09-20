import { Pact, isSignedTransaction, signWithChainweaver } from '@kadena/client';
import { IPactDecimal } from '@kadena/types';
import { listen, submit } from './client';

export type Account = `${'k' | 'w'}:${string}` | string;
export function keyFromAccount(account: Account): string {
  return account.split(':')[1];
}

async function transfer(
  senderUser: { account: string; public: string; secret: string },
  receiverUser: { account: string; public: string; secret: string },
  amount: IPactDecimal,
): Promise<void> {
  const sender = senderUser.account;
  const receiver = receiverUser.account;

  const transaction = Pact.builder
    .execution(Pact.modules.coin.transfer(sender, receiver, amount))
    .addSigner(keyFromAccount(sender), (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId('testnet04')
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

// transfer(accountA, accountB, { decimal: '1' }).catch(console.error);
