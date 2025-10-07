import { Injectable } from '@angular/core';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';
import readMessage from '../utils/readMessage';
import writeMessage from '../utils/writeMessage';

@Injectable({ providedIn: 'root' })
export class AppService {
  async writeMessage(
    account: string,
    message: string,
    walletClient: WalletAdapterClient,
    walletName: string,
  ) {
    try {
      await writeMessage({ account, messageToWrite: message, walletClient, walletName });
    } catch (e) {
      console.log(e);
    }
  }

  async readMessage(account: string): Promise<string> {
    try {
      return await readMessage({ account });
    } catch (e) {
      throw e;
    }
  }
}
