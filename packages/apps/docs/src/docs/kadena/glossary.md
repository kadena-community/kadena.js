---
title: Glossary
description: General and specific terminology related to Kadena.
menu: Kadena
label: Glossary
order: 3
layout: full
---

# Glossary

This glossary defines and explains concepts and terminology that are specific to decentralized computing, blockchain technology, Kadena, or the Kadena ecosystem.

## A

### account

An **account** is an entry in the Kadena `coin` contract ledger—a key-value store—that consists of:

- An account name in the form of a string of 3 to 256 LATIN-1 characters (key).
- An account value that holds the decimal balance and a keyset that governs the account.

```pact
key: Account name -> value: { Balance, Keys }
```

The keyset specifies the signing requirements for the account and consists of one or more public keys and a predicate that indicates the number of keys that must sign a transaction for the account.

### address

In the Ethereum network, an address serves as both an identity and an account. 

The address is derived from the last 20 bytes of the ECDSA public key that controls the account prepended with 0x before the hashed key. 
For example, you might have an address similar to 0x71C7656EC7ab88b098defB751B7401B5f6d8976F on Ethereum. 
You must have an address—sometimes referred to as your wallet address—to send or receive funds and to access the funds, you must have the corresponding private key.

Contracts deployed on the Ethereum network also send and receive transactions using an address.
The functions in the contract are executed when the contract receives a transaction request.
Contract addresses use the same format as wallet addresses.

## B

### Bitcoin

Bitcoin is the world’s very first cryptocurrency, postulated by ‘Satoshi
Nakamoto’ (which is typically presumed to be a pseudonym) in a now-famous white
paper called ‘A Peer-to-Peer Electronic Cash System’ in 2008.

### blockchain

A ‘blockchain’ is a distributed digital ledger that’s used to record
transactions. It’s an immutable database, which means that information can’t be
tampered with or altered once it’s been recorded. If there’s an error in an
entry, then a new, revised entry must be made, and both entries will
subsequently be visible on the ledger.

The name comes from the fact that a blockchain stores data in ‘blocks,’
individual units that are linked, or ‘chained,’ together. New data is filed into
blocks – and blocks are subsequently chained together – in chronological order,
so a blockchain becomes longer and longer as more information is added to it.
Each new piece of information is also assigned a timestamp, which makes it easy
for users to find out exactly when it was linked to the database. The
transparency and immutability of the blockchain makes it a very reliable and
trustworthy business resource both for individuals and companies. Kadena is an
example of a blockchain.

### bridge

A bridge, in a web3 context, is a protocol which links blockchain systems
together, allowing users from one system to send assets and information to
another.

## C

### capability

Capabilities provide a way to manage permissions and authorize certain actions based on specific conditions and separate from transaction signing. Capabilities are a core feature in the Pact smart contract programming language.

### chain identifier

The numeric identifier for a specific chain in the Kadena network. Currently, the chain identifiers are zero (0) through nineteen (19).

### consensus

A consensus mechanism is a system that validates transactions and encodes new
information on a blockchain. The most common consensus mechanisms are
Proof-of-Work (PoW) and Proof-of-Stake (PoS). Kadena uses Proof-of-Work.

### cryptocurrency

Cryptocurrency is a digital currency secured on a blockchain. The blockchain
uses cryptographic proof to secure the currency. This prevents the double
spending issue for digital currencies where a currency unit is used for multiple
payments without being used up. This is where the cryptocurrency name derives
from. Anyone can make a cryptocurrency and they are regulated only by their
underlying protocol or DAO. KDA is an example of a cryptocurrency.

### crypto wallet

A crypto wallet is a software program or physical device that allows you to
store your crypto and allow for the sending and receiving of crypto
transactions. A crypto wallet consists of two key pairs: private keys and public
keys.

## D

### decentralized application (dApp)

A decentralized application, colloquially called a dapp, is an application
constructed on the blockchain. Dapps function autonomously, according to the
stipulations in smart contracts. Like any other application on your phone, dapps
come with a user interface and are designed to provide some kind of practical
utility.

### decentralized finance (DeFi)

Financial services and applications that are not, or
mostly not, controlled centrally, as in Centralized Finance. For example,
Uniswap is a decentralized exchange, versus Coinbase which is a centralized
exchange.

### distributed autonomous organization (DAO)

Generally, refers to a method of management
that has rules coded in software and that has decision making which is not
centralized or hierarchical.&#x20;

## G

### gas

Gas is a unit of measurement that represents the computational effort required
to complete a transaction. How much a user spends to complete a transaction is
determined by the total amount of gas multiplied by the gas price.&#x20;

## I

### interoperability

Interoperability refers to the ability of multiple blockchains to cooperate and
exchange information with one another, enabling virtual assets (such as
non-fungible tokens \[NFTs]), avatars and other pieces of code to move
seamlessly from one platform to another.

## K

### keys

Keys are long strings of numbers used to access the Web3 products stored in your
wallet. There are two forms of keys:

- Your **public key** is the string you share with others to request
  transactions and identify yourself in the ecosystem.&#x20;
- Your **private key** is the string that gives you access to your personal
  crypto assets and to confirm any transactions – a digital signature. This
  should never be shared with anyone.&#x20;

A public key functions like your bank account number, with the private key being
your PIN code. These keys are randomly generated and so can be hard to memorize.
Therefore most wallets employ a string of words known as a “seed phrase” to act
as a passcode to your keys.

### keyset

A **keyset** is a Pact construct used to authorize transactions. 
A keyset consists of one or more **public keys** and a **predicate function** that describes the authorization policy for the keys in the keyset. 
For example, if a keyset has three public keys and the **keys-all** predicate, then all three keys must sign a transaction for the transaction to be valid. 
Pact provides three default keyset predicates: 

- keys-all
- keys-any
- keys-2

Smart contract module authors can define additional predicates.

## L

### layer-1

(L1) blockchains are the foundations of multi-level blockchain frameworks. They
can facilitate transactions without support from other blockchain networks. All
layer 1 blockchains – including Bitcoin and Ethereum – offer their own native
cryptocurrency as a means of accessing their networks.

### layer 2

(L2) blockchains are built on top of layer 1 blockchains, often enhancing the
latter’s performance and expanding its accessibility. Polygon, for example, is a
popular layer 2 blockchain that allows users to enjoy the benefits of using the
Ethereum network without having to go through that network’s relatively slow
transaction speed and costly fees.

## M

### mining

Mining is the process of validating a transaction in a proof of work blockchain.
In mining, a large pool of users compete for tokens to see who can solve a
cryptographic puzzle the quickest using computing power. The difficulty of the
puzzle scales with the total hash power of the entire network, the hash rate.

The costs of mining are well documented, both in the exponential increase in
computing power to continue mining and the detrimental environmental impact.

## N

### namespace

### non-fungible token (NFT)

Non Fungible Token. Tokens that represent something unique, such as crypto art
or collectibles. They cannot be exchanged for something identical. For example,
[CryptoPunks ](https://www.larvalabs.com/cryptopunks)and
[Hashmasks](https://www.thehashmasks.com/gallery).

### node

Nodes are the computers used to secure a blockchain network. These are the
engine of the blockchain, supplying the computing power to maintain it,
validating transactions, and maintaining the consensus of the blockchain that
keeps it secure.

The more nodes a blockchain has, the safer it is. However, this increases the
computational complexity, amount of energy used, and thus the price for making
each transaction.

## O

### oracle

An oracle is any application that provides data from outside the blockchain or
vice-versa. Blockchains can only access data available on their own chains, and
so need oracles to add outside or off-chain data. A typical use case is smart
contracts that need to incorporate real-world data or bridges that require
information from another blockchain to perform an exchange.

For example, if a stablecoin needs to keep its value constantly connected to the
amount of collateral available to that coin, it would need an oracle to identify
how much of that collateral is available. This is because knowledge of the
collateral amount is off-chain data that has to be translated to data usable by
the blockchain.

## R

### Read-eval-print-loop (REPL)

Read-eval-print-loop (REPL) is an interactive shell that enables you to run and test code in a terminal.
In most cases, a REPL is an interpreter for a specific language or compiler that enables you to write and execute programs from a command-line interface.

## S

### smart contracts

Smart contracts are self-executing contracts formed using a blockchain. A smart
contract is a program that can automatically execute agreements on the
blockchain without external oversight, as long as the originally set parameters
of the contract are fulfilled. The blockchain ensures that the contract has been
considered trustworthy – the validation method and the transparent ledger of
previous transactions create the necessary trust.

## T

### tokens

A token is an electronic proof of asset ownership. These are typically split
into two types. Fungible tokens like Kadena are identical, exchangeable tokens;
non-fungible tokens (NFTs) are unique and cannot be reproduced.

While not every blockchain has a token, most deploy a form of token to take
advantage of their utility value.&#x20;

**Uses for tokens include:**

- **Cryptocurrencies** are the most common form of tokens that can be exchanged
  for goods and services. KDA is an example of a cryptocurrency.
- **Payment or utility tokens** can be used to pay for services but only on the
  blockchain that produces the token. These could for instance be the in-game
  currency for a blockchain-based video game.
- **Governance tokens** can be seen as shares in a blockchain, giving you voting
  rights on major decisions regarding the future direction of that relevant
  blockchain.
- **NFTs** that prove ownership over a unique digital asset such as art or a
  venue ticket.

## T

### time-to-live (TTL) 

The expiration time—in seconds—for how long a transaction should be considered valid for inclusion in a block after its creation time. 
In most cases, transactions are processed and included in block in approximately 30 seconds and don't require changes to the default TTL. 
However, the maximum time a transaction can wait to be included in a block is 48 hours after its initial creation.

### tokenomics

A portmanteau of the words 'token' and 'economics,' tokenomics refers to all the aspects of a cryptocurrency that can impact the price such as total supply, vesting, and utility.

### trilemma

The Trilemma refers to the problem every blockchain has in having to compromise
on either security, decentralization, or scalability. Coined by Vitalik Buterin,
one of the Ethereum co-founders, the trilemma points to each of the issues being
interconnected:

- Increasing decentralization makes the blockchain more computationally complex,
  slowing down transaction speed (scalability), and requires more work to keep
  the network secure&#x20;
- Highly secure blockchains cannot handle many transactions efficiently and so
  compromise on scalability&#x20;
- Increasing transaction speed requires reducing the computational load in some
  way. This compromises decentralization and security.

**Kadena’s innovative PoW consensus mechanism called Chainweb makes it the only
blockchain to have solved the infamous blockchain trilemma.**

