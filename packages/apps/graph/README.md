<!-- genericHeader start -->

# @kadena/graph

GraphQL project, available for running your own GraphQL endpoint. This project
uses chainweb-data as the datasource.

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Kadena GraphQL

A GraphQL endpoint that interacts with chainweb-data and chainweb-node.

- [Kadena GraphQL](#kadena-graphql)
- [Useful extra's](#useful-extras)
  - [Connect to the database](#connect-to-the-database)
  - [Fund an account on the devnet](#fund-an-account-on-the-devnet)
  - [Simulate traffic on the devnet](#simulate-traffic-on-the-devnet)
    - [Coin simulation](#coin-simulation)
    - [Marmalade simulation](#marmalade-simulation)
  - [Tracing and trace analysis](#tracing-and-trace-analysis)
  - [Query Complexity](#query-complexity)

# Getting started

First, install dependencies and build up to and including `@kadena/graph`.

```sh
pnpm install --filter @kadena/graph...
pnpm turbo build --filter @kadena/graph...
```

> **NOTE:** you need Docker (or an alternative, e.g.
> [podman](https://podman.io/docs/installation)) to be installed

1. Copy the `.env.example` to `.env`

   ```sh
   cp .env.example .env
   ```

2. Start devnet:

   > **NOTE:** This project has a built-in command to create and start devnet.
   > For the full guide visit the quickstart page on the documentation website
   > [here](https://docs.kadena.io/build/quickstart).

   ```sh
   pnpm run devnet
   ```

   This command will start the existing image, and if not found, download and
   run a new image.

   You can run `pnpm run devnet:update` to update the devnet image.

   In case you always want to get the latest image, you can force docker to pull
   the image by adding `--pull=always` after `docker run` in the `devnet`
   script.

   If something goes wrong, you can delete the volume, and try to start again:

   ```sh
   docker volume rm kadena_devnet
   ```

   > **Windows alternative**  
   > Replace `$HOME` with `%HomeDrive%%HomePath%` in the `devnet` script. If you
   > get an error try not mounting the volume by removing the following part:
   > `-v <arg>`

3. Start the project

   ```sh
   pnpm run start
   ```

4. Go to localhost:4000/graphql and execute this query to see if everything
   works

   ```gql
   subscription {
     newBlocks {
       chainId
       hash
       height
     }
   }
   ```

## Useful extra's

### Connect to the database

You can use Prisma's built in Studio as a database GUI, using
`pnpm run prisma:studio`, or you can connect to the database using `psql`.

You need to have `psql` installed
([How to Install psql on Mac, Ubuntu, Debian, Windows](https://www.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/))

```sh
psql -h localhost -U devnet
```

### Fund an account on the devnet

```sh
npm run fund -- -k <key> -a <amount>
```

- key - public key to fund (default: will generate a new account)
- amount - amount to be funded (default: 100)

### Simulate traffic on the devnet

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
npm run simulate:coin -a <numberOfAccounts> -i <timeInterval> -t <maxAmount> -tp <tokenPool> -s <seed>
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
npm run simulate:marmalade -a <numberOfAccounts> -i <timeInterval> -mt <maximumMintValue> -s <seed>
```

- numberOfAccounts - number of accounts to be created in the devnet (default: 8)
- timeInterval - frequency of transactions in miliseconds (default: 100)
- maximumMintValue - maximum amount a token can be minted at once (default: 25)
- seed - seed for random number generation (default: current timestamp)

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
