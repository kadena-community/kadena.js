import { Component, OnInit } from '@angular/core';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';
import { createEckoAdapter } from '@kadena/wallet-adapter-ecko';
import { createChainweaverLegacyAdapter } from '@kadena/wallet-adapter-chainweaver-legacy';
import { createWalletConnectAdapter } from '@kadena/wallet-adapter-walletconnect';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  account: string = '';
  messageToWrite: string = '';
  messageFromChain: string = '';
  writeInProgress: boolean = false;
  selectedWallet: string = '';
  walletClient: WalletAdapterClient = null as any;
  availableWallets: Array<{name: string, detected: boolean}> = [];
  loading: boolean = false;
  

  constructor(private appService: AppService) {}

  async ngOnInit(): Promise<void> {
    await this.initializeWallets();
  }

  async initializeWallets(): Promise<void> {
    try {
      const adapters = [
        createEckoAdapter(),
        createChainweaverLegacyAdapter(),
        createWalletConnectAdapter(),
      ];

      this.walletClient = new WalletAdapterClient(adapters);
      await this.walletClient.init();

      // Check which wallets are detected
      this.availableWallets = adapters.map(adapter => ({
        name: adapter.name,
        detected: this.walletClient?.isDetected(adapter.name) || false
      }));
    } catch (err) {
      console.error('Failed to initialize wallets:', err);
    }
  }

  async connectWallet(): Promise<void> {
    if (!this.selectedWallet || !this.walletClient) {
      console.error('No wallet selected or client not initialized');
      return;
    }

    this.loading = true;
    try {
      const connectionParams = this.selectedWallet === "ChainweaverLegacy"
        ? {
            accountName: prompt("Input your account"),
            tokenContract: "coin",
            chainIds: ["0", "1"],
          }
        : undefined;

      const accountInfo = await this.walletClient.connect(this.selectedWallet, connectionParams);
      this.account = accountInfo?.accountName || '';

      const networkInfo = await this.walletClient.getActiveNetwork(this.selectedWallet);
      console.log("Connected to", this.selectedWallet, "->", accountInfo?.accountName);
    } catch (err) {
      console.error('Wallet connection failed:', err);
      
      // Provide user-friendly error messages
      if (this.selectedWallet === "Chainweaver") {
        if (err instanceof Error && err.message.includes("fetch")) {
          alert("Chainweaver connection failed. Please make sure:\n• Chainweaver desktop app is running\n• The app is accessible on localhost:9467\n• Your account exists on the blockchain");
        } else if (err instanceof Error && err.message.includes("Account not found")) {
          alert("Account verification failed. Please check:\n• Your account name is correct (should start with 'k:')\n• The account exists on the specified chains\n• You have the correct network selected");
        } else {
          alert("Chainweaver connection failed. Please check your account name and ensure Chainweaver desktop app is running.");
        }
      } else if (this.selectedWallet === "WalletConnect") {
        alert("WalletConnect connection failed. Please try again or check your wallet app.");
      } else {
        alert(`Failed to connect to ${this.selectedWallet}. Please make sure the wallet is installed and try again.`);
      }
    } finally {
      this.loading = false;
    }
  }


  async writeMessage(): Promise<void> {
    this.writeInProgress = true;
    await this.appService.writeMessage(
      this.account,
      this.messageToWrite,
      this.walletClient,
      this.selectedWallet,
    );
    this.writeInProgress = false;
  }

  async readMessage(): Promise<void> {
    this.messageFromChain = await this.appService.readMessage(this.account);
  }
}
// Compare this snippet from angular-test/src/app/app.component.html:
