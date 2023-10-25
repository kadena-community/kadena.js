---
title: Pacty Parrots
description: Learn Kadena’s core concepts & tools for development in 15 minutes
menu: Pacty Parrots
label: Pacty Parrots
order: 4
layout: full
tags: [chainweb, tutorial, resources]
---

# Pacty Parrots

Play the “Pacty Parrots” game to see how dApps and wallets interact.

## What you will accomplish

- Sign a transaction
- See how dApps interact with wallets
- Win some coins! (Maybe)

## Step-by-step instructions

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
    - Preview: You should see a Raw Response of “Write succeeded!” and if so select
      “Submit”


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

## Additional Resources

- [See the Smart Contract Code for Pacty Parrots](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/pacty-parrot)
- [See the Documentation for Implementing the Signing API](https://kadena-io.github.io/signing-api/)
