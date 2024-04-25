---
title: Wallets
description:
  Select a desktop, mobile, Web-based, or hardware wallet to hold KDA—the native cryptocurrency token for the Kadena network—and to manage transfer between accounts.
menu: Wallets
label: Wallets
order: 4
layout: full
---

# Wallets

If you want to buy KDA—the native cryptocurrency token for the Kadena network—from exchange or receive KDA in a transfer from another account, you need to have a secure digital wallet to receive the funds.
There are many desktop, mobile, web-based, and hardware wallets that you can choose from to hold KDA and to transfer KDA between accounts.

This section provides an introduction to the custody solutions available with links to additional information to to get you started.

## Software Wallets

### Chainweaver

Official Kadena wallet for advanced blockchain usage and smart contract development. 
Chainweaver has an integrated signing API that enables you to sign transactions interactively from applications that implement the API.

[Get started with Chainweaver](/invest/wallets/chainweaver)

[Web beta](https://chainweaver.kadena.network)

[MacOS](https://github.com/kadena-io/chainweaver/releases/download/v2.2.3/kadena-chainweaver-mac-2.2.3.0.zip)

[Linux](https://github.com/kadena-io/chainweaver/releases/download/v2.2.3/kadena-chainweaver-linux-2.2.3.0.deb)

[Windows (Virtual Machine)](https://github.com/kadena-io/chainweaver/releases/download/v2.2.3/kadena-chainweaver-vm.2.2.3.0.ova)

### Linx Wallet

Mobile wallet that aims to provide a "chainless" experience.

[Linxwallet.io](https://www.linxwallet.xyz/#)

[Android](https://play.google.com/store/apps/details?id=com.thinedgelabs.linx_wallet)

[iOS](https://apps.apple.com/us/app/thinedgelabs-linx-wallet/id6450412379)

[Discord support](https://discord.gg/FEbnXbV9xZ)

[Telegram](https://t.me/linx_wallet_chat)

### Koala Wallet

Your Passport to the Kadena Ecosystem. Koala Wallet makes it easier than ever to
buy, send, receive, and safely store your Kadena.

[Koalawallet.io](https://koalawallet.io)

[Android and iOS](https://koalawallet.io/download)

[Support](https://support.koalawallet.io/hc/en-us)

[Security](https://koalawallet.io/security)

[News](https://koalawallet.io/news)

### Zelcore

User-friendly multi-network wallet for storing and trading (3rd party). Zelcore
has a signing API to interact with dApps on Kadena Chainweb.

[User Guide](https://babening.io/zelcore-guide)

[Zelcore.io](https://zelcore.io)

### eckoWallet

eckoWALLET is the first Kadena-native web-extension wallet, also available on
iOS and Android. Allows seamless interaction with all the Dapps living on the
Kadena network. Within eckoWallet you are able to send and receive assets,
execute cross-chain transfers, view transactions, interact with dApps, and much
more.

[Chrome Web Store](https://chrome.google.com/webstore/detail/eckowallet/bofddndhbegljegmpmnlbhcejofmjgbn)

[Android](https://play.google.com/store/apps/details?id=com.xwallet.mobile)

[iOS](https://apps.apple.com/us/app/x-wallet-by-kaddex/id1632056372)

## Hardware wallets

### Ledger

In the ever-evolving landscape of digital assets, safeguarding your investments
has never been more crucial. Designed with cutting-edge technology and fortified
with multi-layered security features, the Ledger Hardwallet stands as a
formidable fortress for your cryptocurrencies. With its sleek and compact
design, this hardware wallet offers a seamless user experience, empowering you
with complete control over your digital wealth while keeping it safe from online
threats.

In this doc you will learn how to install the Kadena App, connect to the
Kadena Transfer Tool, view token balances, send tokens, and receive tokens using your Ledger device.

Before You Start, Make Sure:

- You’ve [initialized](https://support.ledgerwallet.com/hc/en-us/articles/360000613793) your Ledger device.
- The latest [Nano firmware](https://support.ledgerwallet.com/hc/en-us/articles/360002731113) is installed.
- Ledger Live is [ready to use](https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live).
- The latest version of the [Kadena Ledger app](https://github.com/ledgerhq/app-kadena) is installed.

To install the Kadena app:

1. Open the My Ledger in Ledger Live.
1. Connect and unlock your Ledger device.
   If asked, follow the onscreen instructions and “Allow My Ledger".
1. Find the Kadena app from the My Ledger catalog.
2. Click **Install**.
   An installation window will appear.
   Your device will display Processing...
   The app installation is confirmed.
1. Close Ledger Live.

To connect to the Kadena transfer tool:

1. Connect and unlock your Ledger device.
1. Open the Kadena App on your Ledger device.
1. Open the [Kadena Transfer Tool](https://transfer.chainweb.com/) in a browser and select **Transfer with Ledger**.
1. Select **Show Ledger Account Name** to confirm that the Ledger Nano app is communicating with the Transfer Tool web app.

To view token balances:

1. Verify the account name provided by the Transfer Tool app by selecting **Verify** in the web app and following the prompts shown on the Ledger device.
2. Using any of the officially recognized wallets, select **Watch Account** and enter the account name verified in the Transfer Tool.
   You should see the Ledger device controlled account added to your account list so the balance on each chain can be seen.

To send tokens:

1. Verify the account name provided by the Transfer Tool app by selecting **Verify** in the web app and following the prompts shown on the Ledger device.
1. Enter the transaction details and select **Sign with Ledger and Transfer**.
   Transactions generated in the transfer tool must be signed using the Ledger device buttons.
   The Ledger app provides a series of prompts which can be used to verify the transaction details prior to signing or rejecting.

To receive tokens:

1. Verify the account name provided by the Transfer Tool app by selecting **Verify** in the web app and following the prompts shown on the Ledger device.
   The provided account name may be used throughout the Kadena ecosystem as a token transfer destination.

## Additional resources

- [Bag of Holding](https://github.com/kadena-community/bag-of-holding) (wallet):
  Terminal Wallet (Community contribution)
- [Secure Key Generation](https://github.com/kadena-community/secure-keygen):
  Package for generating Ed25519 key pairs with user supplied entropy (Community
  contribution)
- [Simple Key Generation](https://kadena-community.github.io/kadena-transfer-js/):
  Generate a key pair with one click (Community contribution)
- [Simple Token Transfer](https://kadena-community.github.io/kadena-transfer-js/):
  Transfer KDA to new or existing accounts (Community contribution)
- [Simple Balance Checker](https://balance.chainweb.com): View the current
  balance of any account
- [Transaction Tester](http://txtool.chainweb.com): GUI for assembling Pact code
  and previewing transactions
- [Finish Cross-chain Transfer](https://kadena-community.github.io/kadena-transfer-js/):
  Enter a Request Key and complete a cross-chain transfer on the recipient chain
  (Community contribution)

## Guides

- [Beginner's Guide to Accounts & Keysets](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14):
  Brief description of keys, keysets, accounts and how they work in Kadena
- [Getting Started with Transfers](/blogchain/2019/kadena-public-blockchain-getting-started-with-transfers-2019-12-19):
  Brief description of transfer types and tools
- [How to generate a KDA address](https://medium.com/kadenacoin/how-to-generate-a-kda-address-fd009a06ea05):
  Article by [Thanos](https://medium.com/@Thanos_42) (Community contribution)
