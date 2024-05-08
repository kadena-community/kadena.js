<!-- genericHeader start -->

# @kadena/explorer

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

# Getting started

@kadena/explorer relies on @kadena/graph to be running. See the [@kadena/graph
README][1] for more information.

First, install dependencies and build up to and including @kadena/explorer:

```sh
pnpm install --filter @kadena/explorer...
pnpm build --filter @kadena/explorer...
```

Then, run the client:

```sh
# To run both explorer and graph:
pnpm run dev:all

# To run only explorer:
pnpm run next:dev

# If you run the explorer for the first time, postfix these commands with :generate
```

[1]: ../graph/README.md
