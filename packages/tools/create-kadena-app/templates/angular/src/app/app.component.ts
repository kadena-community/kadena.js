import { Component, OnInit } from '@angular/core';
import { WalletAdapterClient } from '@kadena/wallet-adapter-core';
import { createEckoAdapter } from '@kadena/wallet-adapter-ecko';
import { createZelcoreAdapter } from '@kadena/wallet-adapter-zelcore';
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
  
  // State for handling Zelcore account modal
  zelcoreAccounts: any[] = [];
  isZelcoreModalOpen: boolean = false;

  constructor(private appService: AppService) {}

  async ngOnInit(): Promise<void> {
    await this.initializeWallets();
  }

  async initializeWallets(): Promise<void> {
    try {
      const adapters = [
        createEckoAdapter(),
        createZelcoreAdapter(),
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
      if (this.selectedWallet === "Zelcore") {
        const accounts = await this.walletClient.getAccounts("Zelcore");

        if (!accounts || accounts.length === 0) {
          throw new Error("No Zelcore accounts found");
        }

        // Open the modal with the list of accounts
        this.zelcoreAccounts = accounts;
        this.isZelcoreModalOpen = true;
        this.loading = false;
        return;
      } else {
        const accountInfo = await this.walletClient.connect(
          this.selectedWallet,
          this.selectedWallet === "Chainweaver"
            ? {
                accountName: prompt("Input your account"),
                tokenContract: "coin",
                chainIds: ["0", "1"],
              }
            : undefined,
        );
        if (!accountInfo) {
          console.error('Failed to connect to wallet');
          return;
        }
        this.account = accountInfo.accountName;

        const networkInfo = await this.walletClient.getActiveNetwork(this.selectedWallet);
        console.log("Connected to", this.selectedWallet, "->", accountInfo?.accountName);
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      this.loading = false;
    }
  }

  // Callback when an account is selected in the modal (for Zelcore)
  async handleZelcoreAccountSelect(selectedAccount: any): Promise<void> {
    try {
      this.loading = true;
      const accountInfo = await this.walletClient.connect("Zelcore", {
        accountName: selectedAccount.accountName,
        tokenContract: selectedAccount.contract || "coin",
        chainIds: ["0", "1"], // Update as needed
      });
      if (!accountInfo) {
        console.error('Failed to connect to Zelcore');
        return;
      }
      this.account = accountInfo.accountName;

      const networkInfo = await this.walletClient.getActiveNetwork("Zelcore");
      console.log("Connected to Zelcore ->", selectedAccount.accountName);

      // Close the modal when an account is selected
      this.isZelcoreModalOpen = false;
      this.zelcoreAccounts = [];
    } catch (error) {
      console.error("Connect error:", error);
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
