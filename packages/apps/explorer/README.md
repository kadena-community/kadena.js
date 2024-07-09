<!-- genericHeader start -->

# @kadena/explorer

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Kadena Block Explorer

![Kadena block explorer][1]

- [Getting started][2]
  - [Running the explorer][3]
    - [Dependencies][4]
      - [Graph][5]
        - [Method 1][6]
        - [Method 2][7]
- [Useful extra's][8]
  - [Running devnet][9]
- [Changelog][10]

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

@kadena/explorer relies on @kadena/graph to be running. See the [@kadena/graph
README][11] for more information.

There are two ways you can use the GraphQL server. You can either run it locally
or you can point the explorer to the existing instances of graph.

##### Method 1: Running your own instance

For this method you can find all the relevant documentation in [@kadena/graph
README][11]. You can also have a look on how to run devnet [here][9]

##### Method 2: Pointing to an existing instance of graph

You can do this by replacing the `.env` variables. Please have a look at=
`.env.example` to see the config variables for both mainnet and testnet
instances

## Useful Extra's

### Running devnet

Prerequisites:

- [pnpm][12]
- [Docker][13] (or an alternative, e.g. [podman][14])

This project has a built-in command to create and start devnet. For the full
guide visit the quickstart page on the documentation website [here][15].

This command will start the existing image, and if not found, download and run a
new image. You can run `pnpm run devnet:update` to update the devnet image.

```sh
pnpm run devnet
```

## Changelog

See [CHANGELOG.md][16].

[1]: ./kadena-block-explorer.png
[2]: #getting-started
[3]: #running-the-explorer
[4]: #dependencies
[5]: #graph
[6]: #method-1-running-your-own-instance
[7]: #method-2-pointing-to-an-existing-instance-of-graph
[8]: #useful-extras
[9]: #running-devnet
[10]: #changelog
[11]: ../graph/README.md
[12]: https://pnpm.io/installation
[13]: https://docs.docker.com/get-docker/
[14]: https://podman.io/docs/installation
[15]: https://docs.kadena.io/build/quickstart
[16]: ./CHANGELOG.md
