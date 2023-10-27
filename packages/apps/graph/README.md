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

# Getting started

First, install dependencies and build up to and including `@kadena/graph`.

```sh
pnpm install --filter @kadena/graph...
pnpm build --filter @kadena/graph...
```

> **NOTE:** you need Docker (or an alternative, e.g.
> [podman](https://podman.io/docs/installation)) to be installed

1. Copy the `.env.example` to `.env`

   ```sh
   cp .env.example .env
   ```

2. Start devnet:

   > **NOTE:** This project has a built-in command to create and start devnet. For the full guide visit the quickstart page on the documentation website [here](https://docs.kadena.io/build/quickstart).

   ```sh
   pnpm run devnet
   ```

   This command will start the existing image, and if not found, download and
   run a new image.

   You can run `pnpm run devnet:update` to update the devnet image.

   In case you always want to get the latest image, you can force docker to pull
   the image by adding `--pull=always` after `docker run` in the `devnet`
   script.

   If something goes wrong, you can delete the volume, and try to
   start again:

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

## Useful commands

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

```sh
npm run simulate -- -a <numberOfAccounts> -i <timeInterval> -t <maxAmount> -tp <tokenPool> -s <seed>
```

- accounts - number of accounts to be created in the devnet (default: 5)
- timeInterval - frequency of transactions in miliseconds (default: 100)
- maxAmount - maximum amount for a single transaction (default: 25)
- tokenPool - amount of circulating tokens (default: 1000000)
- seed - seed for random number generation (default: current timestamp)
