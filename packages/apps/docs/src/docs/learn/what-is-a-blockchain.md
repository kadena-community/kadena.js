---
title: What is a blockchain?
id: blockchain
description: Introduces the basics of blockchain technology and terminology.
menu: Learn
label: What is a blockchain?
order: 1
layout: full
tags: [pact, typescript, account, transactions, utils]
---

# What is a blockchain?

A blockchain is a digital ledger that records transactions in a cryptographically secure and decentralized way. 
Decentralization and transparency are two of the properties that make a blockchain valuable for many different applications. industries, and use cases. 
For example, transactions recorded in the blockchain are public and available for anyone to view, but the records can’t be altered and the participants in the transaction are protected by cryptographic abstraction. 


## Decentralization

One of the most important features of a blockchain network is that its computational resources are distributed across many individual computers.
The individual computers—called nodes—run the blockchain software and communicate with each other as a peer-to-peer (P2P) network, with no central authority—no government, corporation, or institution— controlling it. 
Instead, every node participating in the blockchain network has a copy of the ledger and any changes to the ledger must be verified and agreed to by multiple parties before they are accepted.

Users typically interact with a blockchain by submitting transaction requests, for example, to change the owner of a file or to transfer funds from one account to another. 
On the Kadena network, the transactions requests are validated by computers that solve complex mathematical problems and gossiped to other nodes on the network and if there's agreement—consensus—on the validity of the transactions, they are assembled into a block. 

After they've been accepted, all transactions that make it into a block are publicly visible on the blockchain.

This method of adding new blocks to the blockchain is known as a **proof of work** consensus model and the computers used to perform this work are often referred to as **miners**.
Not all blockchains use proof of work and mining to validate transactions and add blocks to the blockchain, but this approach to creating new blocks has proven to be more secure, reliable, and decentralized than most other consensus models.

## Why it's called a blockchain

Blocks contain transaction results and other information. 
This other information includes a reference to the previous block, its parent block.
This reference uses a cryptographic hash—something like a digital fingerprint—to definitively link each new block to its parent block, forming a chain from one block to the next that cannot be altered after they've been added to the chain. 

Another extremely important feature of  blockchain is its use of **cryptography** to secure transactions and protect the privacy of participants. Each transaction is encrypted using a public key, and can only be decrypted using a private key held by the intended recipient. This ensures that only authorized parties can access the transaction data.

Overall, blockchains offer a way to securely and transparently track transactions without the need for intermediaries, like banks or governments, which can help reduce costs and increase trust in online transactions. Blockchain technology also has the potential to revolutionize a wide range of industries, including finance, healthcare, supply chain management, and more. By providing a secure and transparent way to record and verify transactions, blockchain has the potential to reduce costs, increase efficiency, and improve trust between parties.

---
The method that a blockchain uses to batch transactions into blocks and to select which node can submit a block to the chain is called the blockchain's consensus model or consensus algorithm. The most commonly-used consensus model is called the proof-of-work consensus model. With the proof-of-work consensus model, the node that completes a computational problem first has the right to submit a block to the chain.

For a blockchain to be fault tolerant and provide a consistent view of state even if some nodes are compromised by malicious actors or network outages, some consensus models require at least two-thirds of the nodes to agree on state at all time. This two-thirds majority ensures that the network is fault tolerant and can withstand some network participants behaving badly, regardless of whether the behavior is intentional or accidental.

## Blockchain economics

All blockchains require resources—processors, memory, storage, and network bandwidth—to perform operations. 
The computers that participate in the network—the nodes that produce blocks—provide these resources to blockchain users. 
The nodes create a distributed, decentralized network that serves the needs of a community of participants.

To support a community and make a blockchain sustainable, most blockchains require users to pay for the network resources they use in the form of transaction fees. 
The payment of transaction fees requires user identities to be associated with accounts that hold assets of some type. 
Blockchains typically use tokens to represent the value of assets in an account and network participants purchase tokens outside of the chain through an exchange. 
Network participants can then deposit the tokens in online wallets to enable them to pay for transactions.

## Blockchain governance

Some blockchains allow network participants to submit and vote on proposals that affect network operations or the blockchain community. 
By submitting and voting on proposals, the blockchain community can determine how the blockchain evolves in an essentially democratic way. 
On-chain governance is relatively rare, however, and to participate, a blockchain might require users to maintain a significant stake of tokens in an account or to be selected as a representative for other users.

## Applications running on a blockchain

Applications that run on a blockchain—often referred to as decentralized applications or dApps—are typically web applications that are written using frontend frameworks but with backend smart contracts for changing the blockchain state.

A smart contract is a program that runs on a blockchain and executes transactions on behalf of users under specific conditions. 
Developers can write smart contracts to ensure that the outcome of programmatically-executed transactions is recorded and can't be tampered with. 
Typically, smart contracts don't allow you to access to any underlying blockchain functionality—such as the consensus, storage, or transaction layers.
Instead, smart contracts enable you write programs that take advantage of blockchain features without requiring you to know about the network infrastructure or node operations.

