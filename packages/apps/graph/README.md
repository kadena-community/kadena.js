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

A GraphQL endpoint that interacts with chainweb-data.

# Getting started

First, install dependencies and build up to and including @kadena/graph

```sh
pnpm install --filter @kadena/graph...
pnpm build --filter @kadena/graph...
```

> **NOTE** you need Docker (or an alternative, e.g.
> [podman](https://podman.io/docs/installation)) to be installed

You can run this project without running the devnet (that includes
chainweb-data) by using the embedded postgres server.

1. copy the `.env.example` to `.env`

   ```sh
   cp .env.example .env
   ```

2. choose between **embedded postgres** or **devnet**

   1. **embedded postgres**: If you want to use the embedded database then set
      `USE_EMBEDDED_POSTGRES` to true and uncomment the `DATABASE_URL` from the
      embedded database section in the `.env` file. Skip step 3.
   2. **devnet**: if you want to use devnet, with chainweb-node, -miner and
      -data then set `USE_EMBEDDED_POSTGRES` to false in the `.env` file.

3. In case you choose to run with devnet, start devnet:

   ```sh
   pnpm run devnet
   ```

   This command will start the existing image, and if not found, download and
   run a new image.

   You can run `pnpm run devnet:update` to update the devnet image.

   In case you always want to get the latest image, you can force docker to pull
   the image by adding `--pull always` after `docker run` in the `devnet`
   script.

   If something goes wrong, you can delete the mounted directory, and try to
   start again:

   ```sh
   rm -rf ~/.devnet/l1
   ```

   > **Windows alternative**  
   > Replace `$HOME` with `%HomeDrive%%HomePath%` in the `devnet` script. If you
   > get an error try not mounting the volume by removing the following part:
   > `-v <arg>`

4. Start the project

   ```sh
   pnpm run start
   ```

5. Go to localhost:4000/graphql and execute this query to see if everything
   works

   ```gql
   subscription {
     newBlocks {
       chainid
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

### Fund an account using the faucet

```sh
docker run --rm -it --add-host=devnet:host-gateway enof/devnet:l2-latest --task=fund
```

> **Windows alternative**  
> replace `$(pwd)` with `%cd%`

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
- timeInterval - frequency of transactions in miliseconds (default: 3000)
- maxAmount - maximum amount for a single transaction (default: 25)
- tokenPool - amount of circulating tokens (default: 1000000)
- seed - seed for random number generation (default: current timestamp)
