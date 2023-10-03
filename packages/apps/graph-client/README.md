<!-- genericHeader start -->

# @kadena/graph-client

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

# Getting started

@kadena/graph-client relies on @kadena/graph to be running. See the
[@kadena/graph README][1] for more information.

First, install dependencies and build up to and including @kadena/graph-client:

```sh
pnpm install --filter @kadena/graph-client...
pnpm build --filter @kadena/graph-client...
```

Then, run the client:

```sh
# To run both graph-client and graph:
pnpm run dev:all

# To run only graph-client:
pnpm run next:dev

# If you run the graph(-client) for the first time, postfix these commands with :generate
```

[1]: ../graph/README.md
