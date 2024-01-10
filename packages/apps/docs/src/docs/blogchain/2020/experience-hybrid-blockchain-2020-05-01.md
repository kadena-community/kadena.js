---
title: Experience Hybrid Blockchain
description:
  This article summarizes the concept of a hybrid blockchain, describes a simple
  use case scenario, and then walks through the scenario with a demonstration.
  Follow along at http://hybrid.chainweb.com/ to experience Kadena’s hybrid
  blockchain yourself.
menu: Experience Hybrid Blockchain
label: Experience Hybrid Blockchain
publishDate: 2020-05-01
headerImage: /assets/blog/2020/1_2BA8I4luclrVgk57_6Nb1Q.webp
tags: [chainweb]
author: Taylor Rolfe
authorId: taylor.rolfe
layout: blog
---

# Experience Hybrid Blockchain

## A Demo & Walkthrough

This article summarizes the concept of a hybrid blockchain, describes a simple
use case scenario, and then walks through the scenario with a demonstration.
Follow along at [http://hybrid.chainweb.com/](http://hybrid.chainweb.com/) to
experience Kadena’s hybrid blockchain yourself.

## How does a Hybrid Blockchain Work?

A hybrid blockchain application allows public and private blockchain networks to
share data between them (“interoperate”) through smart contracts deployed on
each network, respectively. The smart contracts from both networks communicate
through a bridge.

In practice, a hybrid blockchain transaction is composed of three parts. For
example:

1.  A user posts new data to a smart contract on Kadena’s public chain

2.  Once mined, this transaction is recognized by a piece of middleware that
    acts as a bridge between the two networks

3.  The bridge calls the corresponding smart contract on the private chain to
    execute a task

- Data sharing can be bi-directional, starting on either the private or public
  side and moving to the other.

![](/assets/blog/2020/1_fXHXkuEYUiXhSPd8lIf-UA.webp)

## Use Case: Hybrid Blockchain Enabling Real-time, Secure Transaction Settlement

**Traditional banking (current state)**

Transferring funds between bank accounts takes moments to approve but days to
settle in the United States, leaving the recipient unable to access pending
funds. Transaction settlement involves numerous intermediaries operating only
during traditional business hours.

**Hybrid blockchain solution**

In this example, using smart contracts in a hybrid application allows customers
to convert crypto assets on the public network into a stablecoin, which can move
between public and private blockchain networks. On the public side, participants
experience the usual ~1 minute transaction settlement on the Kadena
Proof-of-Work network, an easily-verifiable and secure payment system. On the
private side, participants benefit from instant transaction settlement and
reduced operational complexity.

_Note: This is a simplified use case designed to illustrate how data moves
across a hybrid blockchain. To read more industry use cases and discover the
real-world benefits enabled by hybrid blockchain,
see[ Hybrid Blockchain 101](/blogchain/2019/hybrid-blockchain-101-2019-10-23)
and the
[Smart Contract Sharing Economy](/blogchain/2018/blockchain-future-smart-contract-sharing-economy-2018-12-17)._

## Hybrid Demo & Walkthrough

**Requirements**

The demo requires that users install (1) Chainweaver and have a (2) Testnet
account with some funds:

1.  Download the crypto wallet [Chainweaver](https://www.kadena.io/chainweaver)
    to generate a key pair.

2.  Visit the [Coin Faucet](https://faucet.testnet.chainweb.com/) and select
    “Create Account” (creating an account this way automatically funds the
    account with 10 KDA on Testnet).

**Glossary**

- “Kadena (KDA)” is the native cryptocurrency for the Kadena Public network.

- “StablecoinX (SCX)” is a stablecoin which trades 1:1 with KDA on the public
  network.

- “SCX InstantPay” is the token used for instant transaction settlement on the
  private network.

**Walkthrough**

Follow along with the full demo video, or by using the walkthrough instructions
below.

[Experience Hybrid Blockchain](https://www.youtube.com/watch?v=ZXE8AjjGhSA)

1.  Visit [http://hybrid.chainweb.com/](http://hybrid.chainweb.com/) and enter
    your account name

2.  With Chainweaver open, select “Buy SCX.” This will prompt a signing request
    within Chainweaver.

Sign the transaction by filling out the dialog screens:

- “Configuration” tab: No action needed. Press “Next.”

- “Sign” tab: Use the public key associated with your account to grant the `gas`
  and `transfer` capabilities. Press “Next.”

- “Preview” tab: In the Raw Response section, you should see `”Write succeeded.”
  Press “Submit.”

Then allow ~1 minute for the transaction to clear. Select “Refresh Balances” to
confirm success.

3. Transfer SCX from the public network to get SCX InstantPay on the private
   network

Sign the transaction using Chainweaver (as before), allow ~1 minute for the
transaction to clear, then select “Refresh Balances” to confirm success.

4. Transfer SCX InstantPay coins to any existing SCX InstantPay account

Sign the transaction using the demo’s private network in Chainweaver.

- “Configuration” tab: Private network transactions do not require any gas, so
  you may ignore the gas configuration settings. Press “Next”.

- “Sign” tab: The Grant Capabilities sub-section may be left blank. In the
  Unrestricted Signing Keys sub-section, check the box beside the signing
  account’s public key. Press “Next”.

- “Preview” tab: In the Raw Response section, you should see ”Write succeeded”
  (in some cases you might see “Couldn’t get a response from the node” but you
  may still proceed). Press “Submit”.

_Note: In order to execute transactions on the private network, you must first
change the active network within Chainweaver from “Testnet” to a custom network
consisting of the private network’s nodes._

_For the demonstration, let’s call this private network “Kuro.”_

_Here’s how to add a custom network to Chainweaver:_

- _In Chainweaver, select the Settings option from the left-side menu, then
  select Network_

- _Within the Edit Networks section, enter the new network name “Kuro,” then
  press “Create”_

- _In the network list, find this new network and press the arrow button to
  expand the network’s node list. Add 4 nodes to the network:
  34.204.71.247:9002, 54.166.153.21:9000, 54.146.43.204:9001, 54.164.36.85:9003_

- _Finish by selecting “Ok” to close the Network Settings dialog screen_

5. Transfer SCX InstantPay coins on the private network back into SCX coins on
   the public network

Sign the transaction using the demo’s private network in Chainweaver. Your SCX
InstantPay balance will immediately go down, and your SCX balance will go up in
~1 minute once the transaction is mined in a block.

6. Sell SCX to return funds back into KDA

Toggle the active network within Chainweaver back to “Testnet.”

Sign the transaction using Chainweaver, then allow ~1 minute for the transaction
to clear. Select “Refresh Balances” to confirm success.

**Demo Documentation**

To take a closer look at the technical implementation of this Hybrid Demo, you
can view the open-source GitHub repository
[here](https://github.com/fmelp/hybrid-dapp), the public chain hybrid exchange
smart contract
[here](https://github.com/fmelp/hybrid-dapp/blob/master/pact/chainweb/hybrid-exchange.pact),
and the private chain token smart contract
[here](https://github.com/fmelp/hybrid-dapp/blob/master/pact/kuro/hybrid-token.pact).

## Closing Thoughts

A hybrid blockchain application takes advantage of both the efficiency and
availability of a public network, and the security and fast finality of a
private network. With hybrid apps, we can start to create secure digital
marketplaces, and businesses can launch safe, private blockchain-based solutions
that also have the ease of access and scalability of a massively-parallel
Proof-of-Work blockchain. This new landscape allows for unprecedented levels of
business cooperation through safe and verified data sharing across private and
public networks. Only hybrid blockchain can capture both the decentralization of
public networks and the security controls of private networks.
