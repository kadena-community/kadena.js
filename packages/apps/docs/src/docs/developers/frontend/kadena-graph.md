---
title: Query building with GraphQL
description:
  The `@kadena/graph` library is a frontend GraphQL layer built on top of the Kadena blockchain that provides drill-down access to real-time and historical data.
menu: Frontend frameworks
label: Query building with GraphQL
order: 2
layout: full
tags: ['TypeScript', 'query', 'GraphQL', 'Kadena client', 'frontend']
---

# Query building using GraphQL

The `@kadena/graph` package is a frontend GraphQL layer built on top of the Kadena blockchain.
This tool provides a GraphQL interface to the Kadena blockchain to simplify how you access information about blocks, transactions, accounts, and results.
With `@kadena/graph`, you can stream blockchain events as they happen and guild efficient queries to retrieve blockchain data, including block details, transactions within blocks, outcomes of these transactions, and more. 
By leveraging a PostgreSQL database backend, fed by the `chainweb-data` extract, transform, and load (ETL) process, `@kadena/graph` provides a swift and structured way to access blockchain information.

## Why use @kadena/graph?

The primary advantage of using `@kadena/graph` lies in its speed and efficiency. Traditional methods of retrieving data directly from the blockchain can be cumbersome and slow. `@kadena/graph` addresses this by offering a faster interface, thanks to its optimized backend. Moreover, it allows users to subscribe to events, offering real-time updates in a structured format. This removes the need for users to perform complex mappings themselves, streamlining the development process for dApp and wallet developers.

## Upcoming features and enhancements

The development team behind `@kadena/graph` is not resting on its laurels. Future releases will focus on performance improvements, particularly through the addition of specific indexes to the underlying database to enhance query performance. The team is also refining the graph schema to accurately reflect the business domain model. A significant upcoming feature is the development of an explorer web application, offering more functionalities than the current explorer. Additionally, plans to include mempool information in transactions are underway, providing users with data even when transaction results are not yet available.

## Practical applications

`@kadena/graph` finds its utility in various scenarios:

- **For application developers**: It simplifies the retrieval of current account information and is particularly useful for those building on top of Marmalade, a NFT smart contract, by providing token balances directly.
- **For wallet developers**: It enables the display of account balances and transaction histories, and supports features like auto-discovery of associated accounts during wallet imports.

## Considerations for developers and users

While `@kadena/graph` offers numerous advantages, it is important to note that it is still in the early stages of development. Users may encounter schema changes in future releases, although version control allows users to choose their preferred version. Setting up `@kadena/graph` for personal hosting requires running a chainweb-node and chainweb-data. However, it is integrated within the devnet environment, facilitating seamless development experiences.

In conclusion, `@kadena/graph` stands out as a vital tool for anyone looking to interact with the Kadena blockchain more efficiently. Its ongoing development and planned features promise to enhance its utility further, making it an exciting project to watch in the blockchain space.

Absolutely, incorporating that information will make the article more actionable for readers. Here’s the revised section with those details included:

## Try @kadena/graph in action

`@kadena/graph` is not just a theoretical tool; it's ready for real-world testing and use. Whether you're a developer looking to integrate Kadena blockchain data into your applications or a user interested in exploring blockchain transactions and accounts, `@kadena/graph` is accessible on both testnet and mainnet. Here’s how you can start experimenting:

- For mainnet access, visit: https://graph.kadena.network/graphql
- For testnet, head over to: https://graph.testnet.kadena.network/graphql

These URLs provide a direct gateway to query the Kadena blockchain using `@kadena/graph`, allowing developers and users to leverage its capabilities in real-time scenarios. 
Whether it's for developing decentralized pps, wallets, or simply for the curiosity of exploring blockchain data, `@kadena/graph` offers a structured and efficient interface for all your needs.

**Npm install via**: https://www.npmjs.com/package/@kadena/graph
**Source @kadena/graph**: https://github.com/kadena-community/kadena.js/tree/main/packages/apps/graph
**Example on how to use it in a nextjs app**: https://github.com/kadena-community/kadena.js/tree/main/packages/apps/graph-client