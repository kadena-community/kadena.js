<!-- genericHeader start -->

# @kadena/explorer

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

- [Getting started][1]
  - [Running the explorer][2]
    - [Dependencies][3]
      - [Graph][4]
        - [Method 1][5]
        - [Method 2][6]
- [Useful extra's][7]
  - [Running devnet][8]
- [Changelog][9]

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
README][10] for more information.

There are two ways you can use the GraphQL server. You can either run it locally
or you can point the explorer to the existing instances of graph.

##### Method 1: Running your own instance

For this method you can find all the relevant documentation in [@kadena/graph
README][10]. You can also have a look on how to run devnet [here][8]

##### Method 2: Pointing to an existing instance of graph

You can do this by replacing the `.env` variables. Please have a look at=
`.env.example` to see the config variables for both mainnet and testnet
instances

## Useful Extra's

### Running devnet

Prerequisites:

- [pnpm][11]
- [Docker][12] (or an alternative, e.g. [podman][13])

This project has a built-in command to create and start devnet. For the full
guide visit the quickstart page on the documentation website [here][14].

This command will start the existing image, and if not found, download and run a
new image. You can run `pnpm run devnet:update` to update the devnet image.

```sh
pnpm run devnet
```

## Changelog

See [CHANGELOG.md][15].

[1]: #getting-started
[2]: #running-the-explorer
[3]: #dependencies
[4]: #graph
[5]: #method-1-running-your-own-instance
[6]: #method-2-pointing-to-an-existing-instance-of-graph
[7]: #useful-extras
[8]: #running-devnet
[9]: #changelog
[10]: ../graph/README.md
[11]: https://pnpm.io/installation
[12]: https://docs.docker.com/get-docker/
[13]: https://podman.io/docs/installation
[14]: https://docs.kadena.io/build/quickstart
[15]: ./CHANGELOG.md
