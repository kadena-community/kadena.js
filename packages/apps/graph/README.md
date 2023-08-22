<!-- genericHeader start -->

# @kadena/graph

GraphQL project, available for running your own GraphQL endpoint. This project
uses chainweb-data as datasource

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
rush install -t @kadena/graph
rush build -t @kadena/graph
```

> **NOTE** you need Docker (or an alternative, e.g.
> [podman](https://podman.io/docs/installation)) to be installed

You can run this project without running the devnet (that includes
chainweb-data) by using the embedded postgres server.

1.  copy the `.env.example` to `.env`

    ```sh
    cp .env.example .env
    ```

2.  choose between **embedded postgres** or **devnet**

    1.  **embedded postgres**: if you don't want to setup devnet, stop here.
    2.  **devnet**: if you want to use devnet, with chainweb-node, -miner and
        -data change `.env`

            ```sh
            USE_EMBEDDED_POSTGRES=false
            ```

3.  Start devnet:

    ```sh
    docker run -it -p 8080:8080 -p 5432:5432 -p 9999:9999 -v $HOME/.devnet/l1:/root/.devenv enof/devnet:l2-latest-arm64
    ```

    In case you want to get the latest image, you can force docker to pull the
    image: add `--pull always` after `docker run`

    If something goes wrong, you can delete the mounted directory, and try to
    start again:

    ```sh
    rm -rf ~/.devnet/l1
    ```

    > **Windows alternative**  
    > replace `$HOME` with `%HomeDrive%%HomePath%`  
    > if you get an error try not mounting the volume by removing the part
    > `-v <arg>`

4.  Execute custom migrations  
    Wait for the processes to start and "chainweb-node" and "postgres" to be
    "Ready"

    ```sh
    rushx migrate-database
    ```

5.  Add env var to `.env` and modify "USE_EMBEDDED_POSTGRES"

    ```
    DATABASE_URL="postgresql://devnet@localhost:5432/devnet"
    USE_EMBEDDED_POSTGRES=false
    ```

6.  Start the project

    ```
    rushx start
    ```

7.  Go to localhost:4000/graphql and execute this query to see if everything
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
