import { Injectable } from '@angular/core';
import { Pact, signWithChainweaver, getClient, ICommand } from '@kadena/client';
import { environment } from './../environments/environment';

const { kadenaNetworkId, kadenaChainId } = environment;

const accountKey = (account: string): string => account.split(':')[1];

@Injectable({ providedIn: 'root' })
export class AppService {
  async writeMessage(account: string, message: string) {
    try {
      const client = getClient();

      const transaction = Pact.builder.execution(
        Pact.modules['free.cka-message-store']['write-message'](account, message)
      )
      .addSigner(accountKey(account), (withCapability) => [
        withCapability('coin.GAS'),
        withCapability('free.cka-message-store.ACCOUNT-OWNER', account),
      ])
      .setMeta({
          ttl: 28000,
          gasLimit: 100000,
          chainId: kadenaChainId,
          gasPrice: 0.000001,
          sender: account
        }
      )
      .setNetworkId(kadenaNetworkId)
      .createTransaction();

      console.log(`Signing transaction: ${transaction.cmd}`);
      const signedTransaction = await signWithChainweaver(transaction) as ICommand;

      console.log(`Sending transaction ...`);
      const requestKeys = await client.submit(signedTransaction);
      console.log('Send response: ', requestKeys);

      const pollResult = await client.pollStatus(requestKeys, {
        onPoll: (id: string):void => {
          console.log(`Polling ${id}`);
        },
      });

      console.log('Polling Completed.');
      console.log(pollResult);
    } catch (e) {
      console.log(e);
    }
  }

  async readMessage(account: string): Promise<string> {
    const client = getClient();
    const unsignedTransaction = Pact.builder
      .execution(Pact.modules['free.cka-message-store']['read-message'](account))
      .setMeta({ chainId: kadenaChainId })
      .setNetworkId(kadenaNetworkId)
      .createTransaction();

    const { result } = await client.local(unsignedTransaction, {
      preflight: false,
    });

    if (result.status === 'success') {
      return result.data.toString();
    } else {
      console.log(result.error);
      return '';
    }
  }
}
