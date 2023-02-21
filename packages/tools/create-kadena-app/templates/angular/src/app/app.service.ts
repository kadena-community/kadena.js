import { Injectable } from '@angular/core';
import { Pact, signWithChainweaver } from '@kadena/client'
import { environment } from './../environments/environment';

const { kadenaNetworkId, kadenaChainId, kadenaHost } = environment;
const apiHost = `https://${kadenaHost}/chainweb/0.0/${kadenaNetworkId}/chain/${kadenaChainId}/pact`

const accountKey = (account: string): string => account.split(':')[1]

@Injectable({ providedIn: 'root' })
export class AppService {

  async writeMessage(account:string, message:string) {
    try {
      const transactionBuilder = Pact.modules['free.cka-message-store']['write-message'](account, message)
      .addCap('coin.GAS', accountKey(account))
      .addCap('free.cka-message-store.ACCOUNT-OWNER' , accountKey(account), account)
      .setMeta({
        ttl: 28000,
        gasLimit: 100000,
        chainId: kadenaChainId,
        gasPrice: 0.000001,
        sender: account,
      }, kadenaNetworkId)

      // `signWithChainweaver` modifies the `transactionBuilder` that's passed, 
      //   so we use this further down
      // It also returns an array with the transactionBuilders that are passed 
      //   (if one is passed it'll be an array of 1)

      await signWithChainweaver(transactionBuilder)

      console.log(`Sending transaction: ${transactionBuilder.code}`)
      const response = await transactionBuilder.send(apiHost);

      console.log('Send response: ', response);
      const requestKey = response.requestKeys[0];

      const pollResult = await transactionBuilder.pollUntil(apiHost, {
        onPoll: async (transaction, pollRequest): Promise<void> => {
          console.log(
            `Polling ${requestKey}.\nStatus: ${transaction.status}`,
          );
          console.log(await pollRequest);
        },
      })

      console.log('Polling Completed.')
      console.log(pollResult)
    } catch (e) {
      console.log(e)
    }
  }

  async readMessage(account:string): Promise<string> {
    const transactionBuilder = Pact.modules['free.cka-message-store']['read-message'](account)
    const { result } = await transactionBuilder.local(apiHost)
    if (result.status === 'success') {
      return result.data.toString()
    } else {
      console.log(result.error)
      return ''
    }
  }
}
