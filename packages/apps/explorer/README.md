<!-- genericHeader start -->

# @kadena/explorer

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

- [Getting started](#getting-started)
  - [Running the explorer](#running-the-explorer)
    - [Dependencies](#dependencies)
      - [Graph](#graph)
        - [Method 1](#method-1-running-your-own-instance)
        - [Method 2](#method-2-pointing-to-an-existing-instance-of-graph)
- [Useful extra's](#useful-extras)
  - [Running devnet](#running-devnet)
- [Changelog](#changelog)

# Getting started

## Running the explorer

First, install dependencies and build up to and including @kadena/explorer:

```sh
pnpm install --filter @kadena/explorer...
pnpm build --filter @kadena/explorer...
```

Then, run the client:

```sh
# To run both explorer and graph locally:
pnpm run dev:all

# To run only explorer:
pnpm run next:dev

# If you run the explorer for the first time, postfix these commands with :generate
```

### Dependencies

#### Graph

@kadena/explorer relies on @kadena/graph to be running. See the [@kadena/graph README][1] for more information.

There are two ways you can use the GraphQL server. You can either run it locally or you can point the explorer to the existing instances of graph.

##### Method 1: Running your own instance

For this method you can find all the relevant documentation in [@kadena/graph README][1]. You can also have a look on how to run devnet [here](#running-devnet)

##### Method 2: Pointing to an existing instance of graph

You can do this by replacing the `.env` variables. Please have a look at= `.env.example` to see the config variables for both mainnet and testnet instances

## Useful Extra's

### Running devnet

Prerequisites:

- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/) (or an alternative, e.g.
  [podman](https://podman.io/docs/installation))

This project has a built-in command to create and start devnet. For the full guide visit the quickstart page on the documentation website [here][2].

This command will start the existing image, and if not found, download and run a new image. You can run `pnpm run devnet:update` to update the devnet image.

```sh
pnpm run devnet
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

[1]: ../graph/README.md
[2]: https://docs.kadena.io/build/quickstart
