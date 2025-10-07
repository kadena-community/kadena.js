import type { ICommandResult, ICommand } from '@kadena/client';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core'
import {
  Pact,
  createClient,
  isSignedTransaction,
} from '@kadena/client';

import { API_HOST, CHAIN_ID, NETWORK_ID } from './consts';
import getAccountKey from './getAccountKey';

interface IWriteMessage {
  account: string;
  messageToWrite: string;
  walletClient: WalletAdapterClient;
  walletName: string;
}

export default async function writeMessage({
  account,
  messageToWrite,
  walletClient,
  walletName,
}: IWriteMessage): Promise<ICommandResult> {
  try {
    const transactionBuilder = Pact.builder
      .execution(
        // @ts-ignore
        Pact.modules['free.cka-message-store']['write-message'](
          account,
          messageToWrite,
        ),
      )
      .addSigner(getAccountKey(account), (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('free.cka-message-store.ACCOUNT-OWNER', account),
      ])
      .setMeta({ chainId: CHAIN_ID, senderAccount: account })
      .setNetworkId(NETWORK_ID as string)
      .createTransaction();


    const signedTx = await walletClient.signTransaction(walletName, transactionBuilder);
    const kadenaClient = createClient(API_HOST);

    // Handle single transaction (not array)
    const transaction = Array.isArray(signedTx) ? signedTx[0] : signedTx;
    
    if (isSignedTransaction(transaction)) {
      const transactionDescriptor = await kadenaClient.submit(transaction);
      const response = await kadenaClient.listen(transactionDescriptor);
      if (response.result.status === 'success') {
        return response;
      } else {
        throw response.result.error;
      }
    } else {
      throw new Error('Failed to sign transaction');
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}
