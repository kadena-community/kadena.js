# @kadena/graph

@kadena/graph is a GraphQL Server, available for running your own GraphQL endpoint. This project uses chainweb-data as the datasource.

<!-- markdownlint-disable MD033 -->
<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>
<!-- markdownlint-enable MD033 -->

- [Getting started](#getting-started)
  - [Method 1: Using the published npm package](#method-1-using-the-published-npm-package)
  - [Method 2: Building and running from source](#method-2-building-and-running-from-source)
  - [Running your first query](#running-your-first-query)
  - [Example queries per use case](#example-queries-per-use-case)
    - [Wallet related](#wallet-related)
    - [Explorer related](#explorer-related)
    - [Event related](#event-related)
    - [Fungible related](#fungible-related)
    - [Non-fungible related](#non-fungible-related)
- [Features](#features)
  - [Tracing and trace analysis](#tracing-and-trace-analysis)
  - [Query Complexity](#query-complexity)
  - [Prisma JSON field queries](#prisma-json-field-queries)
  - [Paginated results](#paginated-results)
- [Useful extra's](#useful-extras)
  - [Network Information](#network-information)
  - [Running devnet](#running-devnet)
    - [GraphQL](#graphql)
  - [Connecting to the database](#connecting-to-the-database)
  - [Simulating traffic on the devnet](#simulating-traffic-on-the-devnet)
    - [Coin simulation](#coin-simulation)
    - [Marmalade simulation](#marmalade-simulation)
    - [Flood devnet](#flood-devnet)
- [Changelog](#changelog)

## Getting started

If you are not familiar yet with GraphQL, we recommend to first read the [official documentation](https://graphql.org/learn/) on what it is and how it works. In GraphQL, there are three main types of operations: queries, mutations, and subscriptions. In this GraphQL server, we only support queries and subscriptions.

- **Queries** are used to read or fetch data in a readonly manner. Queries should be used when we do not wish or need to have live updates on the retrieved data(eg. a finished transaction);
- **Subscriptions** are useful when listening for data. Unlike queries, subscriptions are long-lasting operations that can change their result over time. The server is capable of pushing updates to the subscription's result. Subscriptions should be used when we need to have live updates on the data we wish to receive (eg. a transaction in progress);

This GraphQL server creates a readonly GraphQL endpoint that retrieves data from a Chainweb node and a [chainweb-data](https://github.com/kadena-io/chainweb-data) PostgreSQL database. The Chainweb node is used to execute pact queries to, for uses such as retrieving account balances. The PostgreSQL database is used to read data such as blocks, transactions, and events. By default, the GraphQL server points to a local devnet instance.

Prequisites:

- [Node.js](https://nodejs.org/en/download/)
- A running Chainweb node and chainweb-data PostgreSQL database with the migrations in `cwd-extra-migrations` applied. If you don't have this set up, see [Running devnet](#running-devnet).

There are two ways you can run the GraphQL server. You can either use the published npm package `@kadena/graph`, or you can build and run it from the source code in this repository.

### Method 1: Using the published npm package

If no modification to the source code is needed, you can use the published npm package `@kadena/graph` to run the GraphQL server. A set of environment variables is defined in the `.env.example` file. These can be overwritten by setting your own environment variables in your system.

```sh
npm install -g @kadena/graph
kadena-graph

# or

npx @kadena/graph
```

### Method 2: Building and running from source

Prerequisites:

- [pnpm](https://pnpm.io/installation)

First, install dependencies and build up to and including `@kadena/graph`.

```sh
pnpm install --filter @kadena/graph...
pnpm turbo build --filter @kadena/graph...
```

Then, run the project:

```sh
pnpm run start
```

### Running your first query

On startup, the GraphQL server runs a set of system checks to see if Chainweb node and the chainweb-data database are reachable. It also checks if all the extra migrations have been executed. If the checks fail, the server will not start. If the checks pass, the server will start and you can access the GraphQL endpoint at `localhost:4000/graphql`.

To do a final check, go to localhost:4000/graphql and execute this query to see if everything works:

```gql
subscription {
  newBlocks {
    chainId
    hash
    height
  }
}
```

If you need to overwrite the default environment variables, you can do so by creating a `.env` file in the root of the project and copying the contents of `.env.example` to it.

### Example queries per use case  

We've curated a list of useful queries and subscriptions tailored for different user types. You can experiment with these examples and more using the GraphiQL Explorer interface.

To get started, ensure you have a local instance of the graph service running on `localhost:4000`.

#### Wallet related

- [Get account balance](http://localhost:4000/graphql?query=query+GetAccountBalance+%7B%0A++fungibleAccount%28accountName%3A+%22k%3A123456789...%22%29%7B%0A++++accountName%0A++++totalBalance%0A++++fungibleName%0A++++chainAccounts%7B%0A++++++chainId%0A++++++balance%0A++++%7D%0A++%7D%0A%7D)
- [Getting account transactions](http://localhost:4000/graphql?query=query+GetAccountBalance%7B%0A++fungibleAccount%28accountName%3A+%22k%3A123456789...%22%29+%7B%0A++++transactions%28first%3A+10%29+%7B%0A++++++edges+%7B%0A++++++++node+%7B%0A++++++++++hash%0A++++++++++cmd+%7B%0A++++++++++++meta+%7B%0A++++++++++++++chainId%0A++++++++++++++creationTime%0A++++++++++++++gasLimit%0A++++++++++++++gasPrice%0A++++++++++++++sender%0A++++++++++++++ttl%0A++++++++++++%7D%0A++++++++++++payload+%7B%0A++++++++++++++...+on+ContinuationPayload+%7B%0A++++++++++++++++data%0A++++++++++++++++pactId%0A++++++++++++++++proof%0A++++++++++++++++rollback%0A++++++++++++++++step%0A++++++++++++++%7D%0A++++++++++++++...+on+ExecutionPayload+%7B%0A++++++++++++++++code%0A++++++++++++++++data%0A++++++++++++++%7D%0A++++++++++++%7D%0A++++++++++%7D%0A++++++++%7D%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D)

#### Explorer related

- [Listen for a transaction](http://localhost:4000/graphql?query=subscription+ListenTransaction%7B%0A++transaction%28requestKey%3A+%22EBS5rExXr7ndvMp6nK_ie-372oIXWVX5JmmKMXkiD4Q%22%29%7B%0A++++sigs%7B%0A++++++sig%0A++++%7D%0A++++cmd%7B%0A++++++meta%7B%0A++++++++chainId%0A++++++++creationTime%0A++++++++gasLimit%0A++++++++gasPrice%0A++++++++sender%0A++++++++ttl%0A++++++%7D%0A++++++networkId%0A++++++nonce%0A++++++payload%7B%0A++++++++...on+ContinuationPayload%7B%0A++++++++++data%0A++++++++++pactId%0A++++++++++proof%0A++++++++++rollback%0A++++++++++step%0A++++++++%7D%0A++++++++...on+ExecutionPayload%7B%0A++++++++++code%0A++++++++++data%0A++++++++%7D%0A++++++%7D%0A++++++signers%7B%0A++++++++address%0A++++++++clist%7B%0A++++++++++args%0A++++++++++name%0A++++++++%7D%0A++++++++id%0A++++++++orderIndex%0A++++++++pubkey%0A++++++++scheme%0A++++++%7D%0A++++%7D%0A++++hash%0A++++id%0A++++result%7B%0A++++++...on+TransactionMempoolInfo%7B%0A++++++++status%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D)
- [Get the 5 latest confirmed blocks on chain 0 and 1](http://localhost:4000/graphql?query=query+GetLatestConfirmedBlocks+%7B%0A++blocksFromDepth%28first%3A+5%2C+minimumDepth%3A+6%2C+chainIds%3A+%5B%220%22%2C+%221%22%5D%29+%7B%0A++++edges+%7B%0A++++++node+%7B%0A++++++++height%0A++++++++hash%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D)

#### Event related

- [Listen to events](http://localhost:4000/graphql?query=subscription+GetLatestEvents%7B%0A++events%28qualifiedEventName%3A+%22coin.TRANSFER%22%29%7B%0A++++name%0A++++requestKey%0A++++parameters%0A++++orderIndex%0A++%7D%0A%7D)

#### Fungible related

- [Get data on a given account for a given fungible](http://localhost:4000/graphql?query=query+GetAccountInfoOnFungible%7B%0A++fungibleAccount%28accountName%3A%22test-coin-account%22%2C+fungibleName%3A+%22test-coin%22%29%7B%0A++++accountName%0A++++fungibleName%0A++++totalBalance%0A++++transactions%7B%0A++++++totalCount%0A++++%7D%0A++%7D%0A%7D)

#### Non-fungible related

- [Get token balances for a given account](http://localhost:4000/graphql?query=query+GetNFTBalances+%7B%0A++nonFungibleAccount%28accountName%3A+%22k%3A123456789...%22%29%7B%0A++++accountName%0A++++nonFungibleTokenBalances%7B%0A++++++balance%0A++++++chainId%0A++++++id%0A++++++info%7B%0A++++++++precision%0A++++++++supply%0A++++++++uri%0A++++++%7D%0A++++++version%0A++++%7D%0A++++transactions%7B%0A++++++totalCount%0A++++%7D%0A++%7D%0A%7D)

Remember, the GraphiQL Explorer is a powerful tool for understanding and interacting with our GraphQL API. Don't hesitate to experiment and learn!

## Features

### Tracing and trace analysis

To enable tracing, set the `TRACING_ENABLED` environment variable to `true` in
the `.env` file. This will enable tracing for all GraphQL queries and mutations
and log them to `traces.log` (by default) in the root directory. You can also
configure the output name of the log file by setting the `TRACING_LOG_FILENAME`
environment variable.

After letting the server run and collect trace data, you can then run the trace
analysis script to get statistics of the traces:

```sh
pnpm run trace:analyse -s <sort> -l <limit>
```

- sort - sort by a field (default: `median`)
- limit - limit the number of queries to output (default: no limit)

### Query Complexity

To enable query complexity limits and calculations, set `COMPLEXITY_ENABLED` to
`true`. The complexity limit, which determines how complex queries are allowed
to be, can be set with `COMPLEXITY_LIMIT`. You can expose the complexity of a
query by setting `COMPLEXITY_EXPOSED` to `true`, which returns the complexity
details in the `extensions` section of the response.

The overal query complexity is calculated by combining the field complexity, the
depth and the breath. The complexity of the fields is determined by the
following rules:

- Fields that do not make external calls: 1
- Calls to Chainweb Node: 7
- Prisma calls without relations: 5
- Prisma calls with relations: 10
- \*In cases of lists, a multiplier is applied for the requested item count.

### Prisma JSON field queries

Some columns in the database are of type `jsonb`. To query these columns, you can supply a stringified JSON object that matches the [JSON object property filters](https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#filter-on-object-property) from Prisma.

An example of such a filter parameter value could be: `events(parametersFilter: "{\"array_starts_with\": \"k:abcdefg\"}")`, in which case, the `parameters` column is a `jsonb` type column which is filtered to only include rows where the value contains an array that has the string `k:abcdefg` on index 0.

Queries that allow such filters:

- `parametersFilter` on the `events` query and `events` subscription.

### Paginated results

Arrays are returned as [Relay Cursor Connections](https://relay.dev/graphql/connections.htm). This means that the results are paginated and you can use the `first`, `last`, `before` and `after` arguments to navigate through the results. The `edges` field contains the actual data, and the `pageInfo` field contains information about the whether there is a next or previous page, and the cursor of the first and last item in the current page. The `totalCount` field contains the total amount of items in the result set.

Note that `first` can only be used with `after`, and `last` can only be used with `before`. If neither `first` or `last` is given, the default amount of items returned is 20.

## Useful extra's

### Network Information

On startup, the GraphQL server will fetch the network information from the Chainweb node. This will store it in memory and contains information about the chain ids, the network id, the network version and the neighbours of each chain.

> ⚠️ **Note:** The network information is only fetched once on startup. If you want to update the network information, you will need to restart the server.

### Running devnet

Prerequisites:

- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/) (or an alternative, e.g. [podman](https://podman.io/docs/installation))

This project has a built-in command to create and start devnet. For the full guide visit the quickstart page on the documentation website [here](https://docs.kadena.io/build/quickstart).

This command will start the existing image, and if not found, download and run a new image. You can run `pnpm run devnet:update` to update the devnet image.

```sh
pnpm run devnet
```

If your devnet instance is empty, you can run the following command to fund an account.

```sh
pnpm run fund -- -k <key> -a <amount>
```

- key - public key to fund (default: will generate a new account)
- amount - amount to be funded (default: 100)

An alternative is to run a full simulation of traffic on the devnet, see [Simulating traffic on the devnet](#simulating-traffic-on-the-devnet).

#### GraphQL

The devnet includes a built-in GraphQL server operating on port `4000`. For convenience, the HTTP API proxies the GraphQL endpoint via the `/graphql` route. Additional information and resources can be accessed on the splash page at port `8080`.

Please note: This built-in version is intended for consumption when not actively developing. If you're making changes to your project, be aware that the built-in GraphQL server will not reflect these updates. In a development scenario, you should set up your own instance of the GraphQL server to test your changes.

### Connecting to the database

If you want to have a quick glance into the chainweb-data database, you can use Prisma's built in Studio as a database GUI, using
`pnpm run prisma:studio`.

### Simulating traffic on the devnet

The simulation uses a seeded random number generator. This means each simulation
is possible to replicate in the exact same order and with the exact same
amounts, given that the inputs stay the same. Note: the created account keys and
request keys of the transactions will not stay the same. When a simulation
starts, some information regarding the transactions is saved on a file. This
file can be found on `packages/apps/graph/src/scripts/devnet/logs`. The filename
is determined by `timestamp` and `seed`.

Advanced: In each iteration a new random number is generated, so that the
transactions are different, with different amounts and to and from different
chains. The new number is generated using the previous one as seed.

#### Coin simulation

In the coin simulation, fungibles are transfered between accounts at a random
order. The simulation is also responsible for creating differents transactions
types such as transfers, cross-chain transfers, and safe transfers.

```sh
pnpm run simulate:coin -a <numberOfAccounts> -i <timeInterval> -t <maxAmount> -tp <tokenPool> -s <seed>
```

- numberOfAccounts - number of accounts to be created in the devnet (default: 6)
- timeInterval - frequency of transactions in miliseconds (default: 100)
- maxAmount - maximum amount for a single transaction (default: 25)
- tokenPool - amount of circulating tokens (default: 1000000)
- seed - seed for random number generation (default: current timestamp)

#### Marmalade simulation

In the marmalade simulation, non-fungibles tokens are created, minted and
transfered between accounts at a random order. The simulation is also
responsible for creating differents tokens along its course.

```sh
pnpm run simulate:marmalade -a <numberOfAccounts> -i <timeInterval> -mt <maximumMintValue> -s <seed>
```

- numberOfAccounts - number of accounts to be created in the devnet (default: 8)
- timeInterval - frequency of transactions in miliseconds (default: 100)
- maximumMintValue - maximum amount a token can be minted at once (default: 25)
- seed - seed for random number generation (default: current timestamp)

#### Flood devnet

In the flood command we are able to flood the network with transactions. We can
alter the configuration via the parameters.

```sh
pnpm run simulate:flood -tx <transactions> -i <interval> -t <totalTx>
```

- transactions - amount of transactions per iteration
- interval - time interval between iterations
- totalTx - total number of transactions before command stops

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).
