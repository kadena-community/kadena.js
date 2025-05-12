import { Component } from '@angular/core';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';
import { eckoAdapter } from '@kadena/wallet-adapter-ecko';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  account: string = '';
  messageToWrite: string = '';
  messageFromChain: string = '';
  writeInProgress: boolean = false;
  walletClient: WalletAdapterClient;

  constructor(private appService: AppService) {
    const adapter = eckoAdapter();
    this.walletClient = new WalletAdapterClient([adapter]);
  }

  async connectWallet(): Promise<void> {
    try {
      await this.walletClient.init();
      console.log('Hello');
      const accountInfo = await this.walletClient.connect('Ecko');
      if (!accountInfo) {
        console.error('Failed to connect to wallet');
        return;
      }
      this.account = accountInfo.accountName;
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  }

  async writeMessage(): Promise<void> {
    this.writeInProgress = true;
    await this.appService.writeMessage(
      this.account,
      this.messageToWrite,
      this.walletClient,
    );
    this.writeInProgress = false;
  }

  async readMessage(): Promise<void> {
    this.messageFromChain = await this.appService.readMessage(this.account);
  }
}
// Compare this snippet from angular-test/src/app/app.component.html:
