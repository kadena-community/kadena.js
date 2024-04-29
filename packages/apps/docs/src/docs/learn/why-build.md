---
title: Why build on a blockchain?
id: whybuild
description: Introduces the basics of blockchain technology and terminology.
menu: Learn
label: Why build on a blockchain?
order: 2
layout: full
tags: [blockchain, internet]
---

# Why build on a blockchain?

The modern internet grew from the simple idea that computers should be able to connect and send messages to each other.
To achieve this goal, a lot of people dedicated time and resources to developing a common set of protocols for everyone to use.
So, given this open history, why are industries, and the internet itself, evolving toward blockchain technology—the so-called Web 3 of the future—when most blockchain networks require their own individual protocols and often can't communicate with computers that aren't part of their blockchain network?

One of the primary reasons for moving in the direction of Web 3 is that the internet allows computers to send messages between each other but makes no guarantees beyond attempting to route them to the proper destination.
Messages—packets of data—can be lost in transmission, intercepted, manipulated, redirected or otherwise compromised.
There are no guarantees that the sender, receiver, or even the message itself haven't been tampered with, intentionally or unintentionally.

Blockchain technology—largely through the use of strong cryptographic standards—offers many of these guarantees about the origin and receipt of messages, ensuring the authenticity and integrity of data transmitted and protecting the privacy and ownership of network participants.
These guarantees make blockchains an attractive platform for many types of applications.
For example. properties like decentralization, transparency, data integrity, privacy, and verifiable records make blockchains well-suited to handle the following common use cases:

- Decentralized and traditional financial and banking services.
- Gaming, digital marketplaces, virtual assets, and non-fungible token (NFT) collections.
- Logistics and supply chain management.
- Healthcare and health data management, interoperability, and patient privacy.
- Real estate transactions and legal services.
- Energy, sustainability, and environmental conservation initiatives.
- Voting, voter identification and governance.
  
As this list suggests, building an application to run on a blockchain can be particular useful when regulation, transparency, and accountability are important.
However, it's also important to note that not all applications can—or should—be built to run on a blockchain.
Every blockchain is, in essence, a resource-constrained environment. There are inherent challenges in any distributed peer-to-peer network.
A blockchain isn't the best place for performing operations that require a lot of computational overhead or that generate a lot of network traffic activity.
In most cases, a blockchain isn't well-suited for storing large amounts of static or dynamic data.
Often, applications can incorporate a blockchain as part of a solution that performs some operations off-chain before submitting the results to be stored on-chain.

If you're interested in designing applications for a blockchain, you should consider what the blockchain does best and structure applications to take advantage of its guarantees but minimize the number of computational overhead of the operations performed on-chain.
If you keep in mind that a blockchain is primarily a digital ledger that records state changes, you'll be well-positioned to build applications that take advantage of the most essential blockchain properties.