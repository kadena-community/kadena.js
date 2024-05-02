---
title: Get started with Chainweaver
description: Chainweaver User Guide
menu: Wallets
label: Get started with Chainweaver
order: 2
layout: full
---

# Get started with Chainweaver

Chainweaver is a desktop or web application that provides a graphical user interface for interacting with Kadena blockchain networks.
You can use Chainweaver to manage accounts, keys, transactions, and smart contracts.
You can also use Chainweaver to hold and transfer digital assets and to sign transactions submitted using Kadena client libraries and applications that use the Kadena signing API.

You can create a new wallet by downloading the [Chainweaver desktop application](https://github.com/kadena-io/chainweaver/releases) or by signing in using the [Chainweaver web application](https://chainweaver.kadena.network/).

## Download and install

As a desktop application, Chainweaver is available for download in three formats: 

- Download a macOS disk image (`.dmg`) for macOS computers.
- Download a Debian package (`.deb`) for Linux distributions.
- Download an open virtual application (`.ova)` for Windows, Linux, and macOS as a virtual appliance.

### Install on macOS

To install on macOS:

1. Download the disk image for [macOS](https://github.com/kadena-io/chainweaver/releases/download/v2.2.3/kadena-chainweaver-mac-2.2.3.0.zip).
1. Navigate to your **Downloads** folder.
2. Double-click to open the downloaded file.
3. Drag the Chainweaver icon into your **Applications** folder.

### Install on Linux

To install on Linux:

1. Download the Debian package for [Linux](https://github.com/kadena-io/chainweaver/releases/download/v2.2.3/kadena-chainweaver-linux-2.2.3.0.deb)
1. Navigate to your **Downloads** folder.
2. Double-click the downloaded file.
3. Click **Install**.

   ![Install on Linux](/assets/docs/deb_install.png)

   You should see a progress bar. 
   Check that the version being installed is the version that you want to install.
   After installation is complete, you can find Chainweaver in the Applications menu.

If you encounter issues installing from the Debian package:

1. Open a terminal shell on your computer.
2. Run the following command:
   
   ```bash
   dpkg -s kadena-chainweaver
   ```
   
   If this command doesn't return the Chainweaver version you expect, run the following command:
   
   ```bash
   sudo dpkg -i ~/Downloads/kadena-chainweaver_1.0.0_amd64.deb
   ```
   
   If this command fails, check the error messages for information about how to address the issue.

### Install using a virtual machine

You can run Chainweaver as an open virtual application (`.ova)` on Windows, Linux, or macOS if you have
[VirtualBox](https://www.virtualbox.org/wiki/Downloads) installed in your environment. 
The `.ova` file requires you to use VirtualBox as your virtualization software.

To install as a virtual application:

1. Download the [Chainweaver VM](https://github.com/kadena-io/chainweaver/releases/download/v2.2.3/kadena-chainweaver-vm.2.2.3.0.ova).
2. Navigate to your **Downloads** folder.
3. Double-click the downloaded file.
4. In the Import Virtual Appliance dialog, review the default settings, then click **Import**.
   
   After importing, you can start the virtual machine by double-clicking **Kadena Chainweaver VM** in the VirtualBox Manager.
   The virtual machine starts like a normal computer, then displays the Chainweaver application.

   ![Chainweaver VM](/assets/docs/ova_started.png)

   You can upgrade to the latest version of Chainweaver by double-clicking **Upgrade Kadena Chainweaver** on the virtual machine desktop.

## Create or restore a wallet

As discussed in [Wallets](/participate/wallets), wallets are the primary way you can hold and manage digital assets.
When you start Chainweaver, you have the option to create a new wallet or restore an existing wallet.

### Create a new wallet

To create a new wallet:

1. ​Set a strong, secret, and unique password for unlocking your wallet. 

   For suggestions on generating secure passwords, see [Basic safety tips](#basic-safety-tips).

2. Record your secret 12-word recovery phrase and store the phrase in a secure location.

   You can copy all of the words at once or hover over each word to view and record it.
   For suggestions on securing your recovery phrase, see [Basic safety tips](#basic-safety-tips).
   .
3. Verify the recovery phrase by typing each word in the correct order to complete wallet creation.
   
   After creating the wallet, you'll be ready to [create an account](/participate/wallets/chainweaver#create-an-accounth1279555262) on the blockchain.

### Restore a wallet using a recovery phrase

To restore access to a wallet using a recovery phrase:

1. Enter your 12-word recovery phrase in the correct order.
2. Set a new password for the wallet you are restoring.
3. Click **Keys** in the Chainweaver navigation panel, then click **Generate Key** to
   restore your keys. 
   
   The same keys are always generated in the same order by using the recovery phrase as a master seed.
   Click **Generate Key** until all of the keys you require are restored.

### Restore an exported wallet

To restore a wallet you have previously exported:

1. Select a properly formatted file to import.
2. Enter the password for the chosen wallet file.

   Importing a wallet file replaces the data in the current wallet.

## Navigating in Chainweaver

​Chainweaver consists of three main elements:

- The **network selector** at the top left enables you to select and confirm the network you want to be connected to.
- The **navigation selection panel** at the left side of the display enables you to navigate to the information you're interested in, for example, Accounts or Keys.

- The **main information panel** in the center of the display enables you to interact with the type of information you selected in the navigation panel.

## Networks

Chainweaver allows you to select the networks and chains you want to interact with, including the Kadena main
network (Mainnet) and the Kadena test network (Testnet).

- If you select the Kadena main network, you can interact with the public blockchain to transfer or receive fungible assets or call smart contract services.
- If you select the test network. you can safely test various blockchain interactions without the risk of losing valuable assets.

Both networks are fully operational, real blockchains. 
However, you can only acquire KDA coins from a [coin faucet](https://faucet.testnet.chainweb.com) for use on the test network.
Account balances cannot move between networks.

### Change between networks

You can change the network you're interacting with by selecting
a network from the network selector.

![Change the network you're interacting with](/assets/docs/change-networks.png)

The keys displayed for your wallet persist across networks.
Accounts are refreshed to display the accounts you have added on the selected network.

### Create a custom network

You can add a custom network to Chainweaver by clicking **Settings**, then clicking **Network**.

To create a new network:
1. Type a network name, then click **Create**.
2. Enter the host names addresses and ports for one or more nodes in the network that you want to connect to. 
   
   Typically, a network should connect to at least three nodes.
   The node status is displayed with a traffic light style indicator.

   Custom networks are defined locally and are only visible in the Chainweaver application. 

## Keys, accounts, and ownership

In brief, **keys** sign transactions and **accounts** can be governed by one or more keys.

With most blockchains, accounts are modeled as simply public/private key pairs.
This one-to-one model keeps things simple, but runs into problems when account control requires a many-to-many model (such as with jointly-owned or majority-ruled accounts).

Kadena natively supports multiple keys governing the same account, and thus the distinction between keys and accounts becomes important.

Every account is governed by a **keyset** that is defined when creating the account. 
Keysets are composed of two parts:

- A list of **public keys** that are associated with the account.
- a **predicate** function that determines the keys required to sign for the account when it comes to transactions.
  For example, the predicate determines whether all keys must be present, or if only one key is needed.

Keysets look like the following as JSON data:

```typescript
{
  "keys": ["pubkey1", "pubkey2",...,"pubkeyN"],
  "pred": "some governance function"
}
```

When signing a transaction, the list of keys supplied as signing key
pairs is checked against the keyset and predicate to ensure that all required keys are accounted for and that the predicate is satisfied.

### Generate a key

The first step towards transacting on the Kadena blockchain is to generate a key pair. 
Chainweaver automatically generates your first key.
To generate additional keys for your wallet, click **Keys** in the Chainweaver navigation panel, then click **Generate Key**.

### Create an account

Accounts are equivalent to your identity on the blockchain. 
After you add an account in Chainweaver, you can view information about its keyset and balance on each of the known chains.

In most cases, you create an account on the Kadena blockchain by transferring some funds to it. 
In doing so, you complete a “transfer and create” operation in a single transaction.

How you transfer funds to the account will depend where you're transferring funds from and the network and chain you're transferring the funds to.
For example, if you're on the test network, you can use the [Developer Tools](https://tools.kadena.io) faucet to transfer funds using a public key you own.

In Chainweaver, there are two ways you can complete a “transfer and create” operation:

- Click **Receive** next to a specific chain ID row to define a keyset and generate a raw transaction that can be used to complete the transfer.
- Click **Transfer coins**, fill in the **From** and **To** fields, then click **Sign & Transfer** to complete the transaction.

![Transfer funds to create an account](/assets/docs/account-create.png)

For convenience, Chainweaver will automatically define the keyset for accounts
that have the same name as the single public key which controls it.

Remember that the Kadena public blockchain network is comprised of many chains braided together. 
In effect, each chain is a standalone blockchain.
Therefore, you must create your account on each chain where you want the account to exist. 
The account balance is chain-specific, so the same account name is likely to have different account balances on each chain, and might also have different owners or a different keyset. 
Always take note of the chain you're transferring funds into and transferring funds out of.

By convention, accounts that only have one public key use the k: prefix following by the public key as the account name. 
This convention reduces confusion about which key is associated with your account.

### Account ownership

Kadena natively supports multiple keys governing the same account, allowing for
dynamic account controls such as jointly-owned accounts or the ability to rotate
the keys that govern an account.

It's important for you to clearly understand the accounts you own and any accounts you don't own. 
For convenience, Chainweaver displays whether you are the owner of any account that you are
watching.

- If Chainweaver generated all of the keys in an account, it will indicate “yes”
  for Owner.
- If Chainweaver generated some but not all of the keys in an account, it will indicate
  “joint” for Owner.
- If Chainweaver generated none of the keys in an account, it will indicate “no”
  for the Owner.

![ownership-examples](/assets/docs/ownership-examples.png)

## Wallet and development environment

Chainweaver is designed as a one-stop-shop for interacting with the
blockchain.

As a cryptocurrency wallet, Chainweaver can:

- Deterministically generate multiple key pairs.
- Configure and manage multiple accounts, each with custom access controls.
- Send and receive KDA across any Kadena chain, and adjust gas preferences.
- Watch the status of existing accounts like an address book of known accounts.
- Change networks to interact with Kadena main network, test network, or a custom network.

As a development environment, Chainweaver can:

- Expose all the features available in the Pact smart contract language.•
- Perform common IDE functionality: code editor, automation tools, error messages.
- Facilitate the testing of contracts with a REPL • Preview results and deploy smart contracts to any Kadena network.
- Display a list of example contracts.
- View code and call functions from any deployed smart contract.
- Automate transaction signing between decentralized applications and accounts.

### Remove an account

To remove an account from your wallet:

1. Click **Details** for the account you want to remove.
2. Click **Remove Account**.
3. Read the warning message and confirm the removal by clicking **Remove Account**.

## Receive Kadena (KDA)

To receive KDA, you should provide your account name and the chain ID to the sender.
If you're receiving KDA from a sender who is using Chainweaver, you can click **Receive** to generate a transaction for a selected account and chain ID to share with the sender.

If the account where you are receiving KDA does not yet exist on the selected chain, then the
sender will define the keyset that governs the new account. 
After KDA has been transferred to the account, you should check the account ownership is set up properly.

## Send Kadena (KDA)

Since the Kadena public blockchain network braids multiple chains together, you
can transfer KDA within a single chain or across two different chains.

### Transfer between accounts on the same chain

To transfer between accounts on the same chain:

1. Click **Accounts** in the Chainweaver navigation panel.
2. Click **Transfer Coins**.
3. Fill in the required **From** and **To** fields.
4. Click **Sign & Transfer**.
5. Review the transaction metadata, then click **Next**.
6. On the Signatures tab, add any external signatures, if required, then click **Preview**. 
7. Review the Summary and Transaction Result, then click **Send Transfer** to submit the transaction to the blockchain.

![Preview the transaction](/assets/docs/transaction-preview.png)

### Transfer between accounts on different chains

This process has one distinct difference from transfers on the same chain. 
For cross-chain transactions, you must select two gas payers:

- Gas payer on the originating chain to initiate the transfer.
- Gas payer on the destination chain to redeem the transfer.

![Completing a cross-chain transfer](/assets/docs/cross-chain-transfer.png)

It might seem unusual to pay for gas twice.
However, in a cross-chain transfer, you are moving coins between two different blockchains, each with its own ledger. 
Therefore, the gas on one chain cannot pay for executing operations on a different chain.

To transfer between accounts on different chains:

1. Click **Accounts** in the Chainweaver navigation panel.
2. Click **Transfer Coins**.


### Transfer from external accounts

In addition to signing transactions for accounts that are in the Chainweaver wallet, Chainweaver also provides an interface to sign transactions from accounts that aren't owned by the wallet. 
If the sending account is not an account that's owned by the wallet, Chainweaver presents a field for you to enter the required private keys. 
This feature makes it to transfer KDA into Chainweaver from external wallets and exchanges.

## Adjust gas price and gas limit

Before you submit any transaction or deploy any smart contract, Chainweaver allow you to configure transaction settings, including the gas price and the gas limit for your transaction. 
If you adjust these settings, you can see how the changes affect the transaction speed and maximum transaction
fee.

![adjust-gas](/assets/docs/adjust-gas.png)

Chainweaver doesn't charge fees to send or receive transactions. 
All transaction fees go directly to miners as compensation for providing the compute power required to execute the operation.

## Track transactions

After you submit a transaction, Chainweaver displays the Transfer Status, so you can view its progress. 
Depending on the transaction speed you assigned to the transaction, the transaction might take several blocks before you see the transaction result.

When the transaction has been successfully mined in a block, the Transfer Status indicates there was a successful result.
If the transaction fails at any point, the Transfer Status displays a red **X** beside the failing state.

![transaction-fail](/assets/docs/transaction-fail.png)

If you have a request key from a previously-submitted transaction, you can also display its result by clicking **Check Tx Status**.

## Basic safety tips

As with any valuable asset, it is important to establish a secure and reliable method for controlling who has access to it. 
While Chainweaver is designed to satisfy strict security standards, you are ultimately responsible for maintaining the security of your wallet’s access credentials—the password and recovery phrase.

### Passwords

Consider using a password manager to generate a strong password with randomness of character types. If you decide to create a password yourself, make sure it is not the same or similar to any other password you have ever used.

If you lose your password, you can reset it by using your 12-word recovery phrase to restore the wallet with a new password.

If you lose both your password and the recovery phrase, you will permanently lose access to any accounts and their funds forever.

Kadena does not manage accounts with information such as passwords, private keys, or recovery phrases. 
Kadena only has access to the information that is publicly available on the blockchain. 
We do not have servers and we do not hold your assets.

### Recovery phrases

The 12-word phrase is the master seed that generates all your wallet’s public and secret key pairs. 
With this phrase, anyone can control your wallet, even from another device. 
Consider securing more than one copy to prevent a single point of failure from events like fires, loss, and so on.

Kadena does not control any of your personal or private data on our servers. 
Never share passwords or recovery phrases with anyone, including the Kadena team. 
We will never ask for you to provide this. 
If someone claims that we do, insist on not sharing.

### Who can access your account

Anyone with your wallet's password, private keys, or recovery phrase can access your account. 
Passwords, private keys, and recovery phrases are in your hands and are your responsibility. 
Chainweaver is simply an interface that allows you to more easily interact with your accounts and the Kadena blockchain.

Kadena staff will never ask for sensitive information, including passwords, recovery phrases, or private keys.
Beware of fake accounts and scam attempts.

## Change password

You can change the password for your wallet at any time.

To change the password:

1. Click **Settings** in the Chainweaver navigation panel.
2. Click **Change Password**.
3. Type the current password, type and confirm the new password, then click **Submit**.

## Export wallet

Exporting wallet data generates an encrypted file containing sensitive and non-sensitive information available within the wallet. 
The file is protected by the wallet password that was in use at time of the export. 
You should store the exported wallet file in a secure location and should not alter its contents.

The wallet data to be exported within this file includes:

- Generated public/private key pairs
- Added accounts
- Account notes
- Network configuration
- Transaction configuration

This password-protected wallet file can be imported to Chainweaver as a recovery
method to restore the state of the wallet at the time the file was created.

To export the wallet:

1. Click **Settings** in the Chainweaver navigation panel.
2. Click **Export Wallet**.
3. Type the current password for the wallet, then click **Export wallet**.
4. Select a secure location for the encrypted file, then click **Save**.

## View and export transaction log

You can view and export the transaction log for your wallet at any time.

To view recent transactions or export the transaction log:

1. Click **Settings** in the Chainweaver navigation panel.
2. Click **Transaction Log**.
3. Click **Export Full Transaction Log** to download the complete record of transactions.
4. Select a location for the transaction log, then click **Save**.

View and export your wallet’s transaction log by navigating to the Settings
section and selecting the appropriate button.

## Log out

To end a Chainweaver session, you should log out to lock your wallet.
A locked wallet cannot sign transactions or receive signing API calls.

To log out and lock your wallet:

1. Click **Logout** in the Chainweaver navigation panel.

## Troubleshooting

Most common problems can be resolved by signing out and signing back in or by uninstalling and reinstalling the software.
The topics in this section provide answers to the most commonly-asked questions.

### Debian installation

If you have problems installing using the Debian package, you should remove Chainweaver then try to reinstall it using the command line.
Removing Chainweaver won't delete your wallet, just Chainweaver itself.

To reinstall:

1. Open a terminal shell on your computer., t
2. Type the following command:
   
   ```bash
   sudo dpkg -r kadena-chainweaver
   ```

### Virtual machine image

You only need to import the `.ova` file the first time you access Chainweaver. 
To start Chainweaver again, open VirtualBox from the start menu. 
You can then double-click **Chainweaver VM** in VirtualBox Manager to start Chainweaver.

![ova vm menu](/assets/docs/ova_startvm.png)

To stop the virtual machine, you should shut it down like a physical computer.

1. Click **Applications**.
2. Click **Log Off**.
3. Click **Shutdown**.

![shutdown menu](/assets/docs/ova_shutdown.png)

It is safe to close the VirtualBox Manager window at this time.

#### Upgrading the Virtual Machine

When a new version of Chainweaver is released, you don't need to download a new OVA every time. 
Instead, close the Chainweaver application inside the VM and notice these two icons on the desktop. 
Click **Upgrade Chainweaver** to run an update script. 
After you run the script, click the other desktop icon to restart Chainweaver.

![desktop icons](/assets/docs/ova_desktop.png)

#### VT-x / AMD-v Error on Import / Startup

VirtualBox requires certain hardware acceleration to be able to operate. 
Almost all modern computers have this feature (VT-x for Intel and AMD-v for AMD CPUs) but some computers ship with it off by default. 
If you see an error like this when importing or starting the VM, it is turned off for your computer.

![Virtualisation CPU support error](/assets/docs/ova_vtx_error.jpg)

You'll need to turn this on in your system firmware menu. 
Known systems where this is necessary are:

- Lenovo:
  [https://support.lenovo.com/au/en/solutions/ht500006](https://support.lenovo.com/au/en/solutions/ht500006
