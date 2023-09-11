---
title: Decentralized Oracles How Kadena is Redefining Data Reliability
description:
  Decentralized Finance (DeFi) has taken the blockchain world by storm, offering
  new ways for individuals to access financial services without the need for
  traditional financial institutions. However, for DeFi to truly succeed, it
  must be able to interact with the real-world data that is necessary for
  financial applications to function properly. This is where Oracles come in.
menu: Decentralized Oracles
label: Decentralized Oracles
publishDate: 2023-04-25
author: Kadena
authorId: kadena
layout: blog
---

# Decentralized Oracles: How Kadena is Redefining Data Reliability

![](/assets/blog/1_xwHa6WkMdrc7q43KhHDdJQ.webp)

Decentralized Finance (DeFi) has taken the blockchain world by storm, offering
new ways for individuals to access financial services without the need for
traditional financial institutions. However, for DeFi to truly succeed, it must
be able to interact with the real-world data that is necessary for financial
applications to function properly. This is where Oracles come in.

Oracles provide DeFi applications with access to off-chain data such as price
feeds, market data, and other critical information. Kadena has recognized the
importance of Oracles in the DeFi vertical and supports projects that provide
Oracle solutions.

In this article, we’ll be providing an overview of Oracle basics and how Kadena
is leveraging them to create a more secure and efficient blockchain ecosystem.

### What is an Oracle?

Oracles are mediums that provide real-life data to blockchain applications,
bridging smart contracts to external databases. They serve as a link between
smart contracts running on the blockchain and external sources of data that are
stored off-chain. They are responsible for retrieving, verifying, and
transmitting real life data to the blockchain and enabling the execution of
smart contracts based upon the inputs and outputs from the real world.

Essentially, Oracles provides a mechanism for triggering smart contracts.
Without Oracles, dApps would only have access to on-chain data.

![](/assets/blog/1_O7eQglmM-l55E50xTneO_A.webp)

### Use cases for Oracles

Here are some real use-case for Oracles:

_Example 1_

Let’s say there’s a decentralized application (**dApp**) for insurance that uses
blockchain technology to store policy information and process claims. When a
user buys an insurance policy, the premium is paid in cryptocurrency and stored
in a smart contract. If the insured event occurs, the user can file a claim, and
the smart contract will automatically process the claim and pay out the
appropriate amount.

How does the smart contract know whether the insured event actually occurred? It
needs an oracle mechanism to verify the event. For example, if the policy is for
crop insurance, the oracle could be a weather data provider that reports on
whether a specific region experienced a drought or flood. The oracle would
provide the necessary information to the smart contract, which would then
process the claim and pay out the appropriate amount to the user.

### What is the Oracle problem?

Data that is retrieved by oracles becomes immutable only when it is recorded on
the blockchain. Who authenticates data provided to the chain? How do we know
that the data is accurate and true if it is coming from centralized points that
require third-party permissions? Clearly, there is a conflict between trust,
security, and reliability of third-party oracles. This conundrum is called the
Oracle Problem.

### The Solution to the Oracle Problem: Decentralized Oracles

In order to prevail over this problem, oracles need to provide and guarantee the
reliability and security offered by blockchains.

Solution: Decentralized Oracles.

Decentralized oracles alleviate the Oracle problem by not having to rely on a
single point of failure. Their primary goal is to overcome the limitations of
centralized oracles.

To achieve this, a network of nodes is used to obtain real-life data from
several off-chain sources instead of one central source. This data is then
transferred to smart contracts on-chain, enabling the integration of external
information into the blockchain ecosystem. A decentralized oracle can be
compared to a public library with multiple sources of information. By gathering
information and data from multiple sources, it minimizes false or inaccurate
data, improving trust and reliability. This enables them to deliver data in a
trustless manner, ensuring greater accuracy, reliability and security.

### How is Tellor changing the game with Decentralized Oracles?

[Tellor](https://tellor.io/) is a decentralized oracle protocol that
incentivizes an open, permissionless network of data reporting and data
validation, ensuring that data can be provided by anyone and checked by
everyone. In an oracle landscape dominated by fully centralized services, Tellor
sets itself apart from other competitors by identifying and creating a need and
creating an oracle.

Tellor is working with Kadena to develop an oracle service to support DeFi
infrastructure on the Kadena blockchain and has completed the development of the
oracle protocol in Pact, which you can view
[here](https://github.com/tellor-io/Tellorflex-kadena). Tellor’s vision is
centered on utilizing effective crypto-economic incentives to encourage
anonymous participants to report data on-chain, while also enabling anyone to
dispute this information. By discouraging malicious or erroneous actors, we
aimed to create a streamlined yet resilient oracle. Moreover, Tellor aspires to
design a protocol that is agile and adaptable enough to provide any data,
anywhere.

Oracles are essential components in enabling blockchain technology to interact
with the real world, providing access to real-life data to smart contracts. With
the help of **[Tellor](./spotlight-on-tellor-2023-03-07)**, Kadena can deliver
real-world solutions that can solve complex problems in various industries from
insurance to finance.

If you enjoyed this article, make sure to follow Kadena for more educational
content!
