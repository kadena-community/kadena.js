---
title: Sign the Memory Wall
description: Learn Kadena’s core concepts & tools for development in 15 minutes
menu: Sign the Memory Wall
label: Sign the Memory Wall
order: 1
layout: full
tags: [chainweb, chainweaver, tutorial, resources]
---

# Sign the Memory Wall

Engrave your name with the Kadena “Memory Wall” smart contract.

**What you will accomplish**

- Perform a real Mainnet transaction
- View your transaction on the Block Explorer

### Step-by-step instructions

1. Go to [hello.chainweb.com](https://hello.chainweb.com)
2. Type your name and then submit
3. Wait for the transaction to be mined in a block
4. Upon success, click the Block Explorer link or go to explorer.chainweb.com to
   find your transaction under “Recent Transactions”

:::note Key takeaway

Something hidden just allowed you to instantly interact with a real blockchain,
yet you did not have to create an account or own tokens to pay the transaction’s
gas. This is possible thanks to gas stations, an autonomous account that exists
only to fund gas payments on behalf of other users under specific conditions. By
having a gas station pay user onboarding costs, we remove the friction of
acquiring tokens in advance of signup, which allows a user’s first interaction
with a dApp to become as easy as filling out a web form.

:::

### Additional Resources

- Read more about gas stations
  [here](/blogchain/2020/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-2020-08-06).
- [See the Smart Contract Code for Memory Wall](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/memory-wall)

## Setup Chainweaver

Setup Chainweaver, Kadena’s official wallet and developer workbench.

### What you will accomplish

- Setup a secure KDA wallet
- Get introduced to Kadena's primary developer workbench & IDE

### Step-by-step instructions

1. Go to [kadena.io/chainweaver](https://kadena.io/chainweaver-tos/)
2. Agree to the terms of service and click "Create new wallet"
3. Follow the 3-step process for creating a new wallet:
   - Set password
   - Record recovery phrase
   - Verify recovery phrase

To download Chainweaver and find detailed instructions on Chainweaver usage go
here [Chainweaver User Guide](/kadena/wallets/chainweaver).

## Testnet Account Setup

Create and fund a Testnet account on chain 1 using the “Coin Faucet” smart
contract.

### What you will accomplish

- Create an account
- Get some Testnet KDA coins

### Step-by-step instructions

1. In the Keys section of Chainweaver and copy your public key
2. Go to [faucet.testnet.chainweb.com](https://faucet.testnet.chainweb.com/)
3. Select “Create and fund new account”
4. Enter your public key in the “Public Key” field
5. Enter some unique name in the “Account Name” field
6. Select “Create and fund new account”
7. Wait about 30 seconds, then select “Check Request Status” to see the
   transaction confirmation message
8. Go back to Chainweaver and in the account section click on "+ Watch Account"
9. Type the account name you have chosen for yourself and click "Add"
10. You should see all 20 tokens you have received from the Testnet faucet!

### Additional Resources

- [See the Smart Contract Code for Coin Faucet](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/faucet)

## Pacty Parrots

Play the “Pacty Parrots” game to see how dApps and wallets interact.

### What you will accomplish

- Sign a transaction
- See how dApps interact with wallets
- Win some coins! (Maybe)

### Step-by-step instructions

1. Make sure Chainweaver is still open on your computer
2. Go to
   [pactyparrots.testnet.chainweb.com](http://pactyparrots.testnet.chainweb.com/)
3. Skim through the game rules and then enter the account name you recently
   created
4. Select “Start new round” to begin the game
5. When Chainweaver pops up you will be prompted with a signing request which
   has 3 parts:

   - Configuration: View transaction info and adjust settings if desired
   - Sign: Select your public key in each of the 3 “Grant Capabilities” fields
   - Preview: You should see a Raw Response of “Write succeeded!” and if so
     select “Submit”

6. Watch the parrots dance and wait for your result
7. Choose to “Spin again” or “Cash out” which will prompt another transaction to
   sign via Chainweaver

:::note Key Takeaways

For developers and end users, navigating wallet-dApp interaction can be a
challenging experience. For example, developing with Ethereum requires wallets
and dApps to integrate intricate web3.js code in order to perform necessary
signing operations.

Kadena simplifies this interaction with a signing API. There is no need to embed
a web browser or to store private keys in a browser plug-in.

As a developer on Kadena, when your dApp needs to send a signed transaction,
simply make an AJAX request to the signing API on localhost port 9467. Then the
user's wallet will handle the details of transaction signing.

:::

### Additional Resources

- [See the Smart Contract Code for Pacty Parrots](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/pacty-parrot)
- [See the Documentation for Implementing the Signing API](https://kadena-io.github.io/signing-api/)

## Apply your knowledge to build a brand new dApp

### What you’ve accomplished

1. Created and funded an account
2. Performed multiple transactions
3. Interacted with Mainnet and Testnet
4. Used a gas station and signing API
5. Used Block Explorer and Chainweaver

## What’s Next?

You are now familiar with the core concepts and tools for developing powerful
and user-friendly applications with Kadena. Take your learning to the next level
with any of these paths:

Follow a guided template to create a complete dApp with a React frontend.

- [Go to create-pact-app](https://github.com/kadena-io/create-pact-app)

Learn Pact, Kadena’s human-readable smart contract language.

- [Go to Pact Developer Tutorials](/pact)

Deepen your understanding of Pact and the Kadena ecosystem by following the Real
World Pact core concepts guide and tutorial series, building from a testnet
faucet to a DeFi lending platform.

- [Go to Real World Pact](https://github.com/thomashoneyman/real-world-pact)

Already have a dApp idea? Apply to our Developer Program to get technical and
marketing support from Kadena.

- [Go to Developer Program](/kadena/resources#developer-programh1574074382)
