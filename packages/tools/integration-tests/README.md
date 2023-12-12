<!-- genericHeader start -->

# @kadena-dev/integration-tests

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

This package contains integration tests for various Kadena libraries, primairily to verify integration with the chain

## Table of Contents

- [Table of Contents][1]
- [Installation & Usage][2]

## Installation & Usage

All projects expect devnet to be served on localhost:8080. Currently, this contains houses tests for
- @kadena/graph

### @kadena/Graph
Graph performs a few migrations upon starting devnet, For more information on how to start devnet for this project, refer to the readme for Graph.

Note: the following commands have been written to be executable from the root of
the monorepository.

1.  Install dependencies:

```sh
pnpm install
```

3.  Run test suite, substitute `@kadena/graph` for any of the available projects 
    described in the [vitest.projects.ts][4]

```sh
 pnpm --filter @kadena-dev/integration-tests run test:integration -- @kadena/graph
```

[1]: #table-of-contents
[2]: #installation-&-usage
