<!-- genericHeader start -->

# @kadena-dev/e2e-base

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

E2E Tests for Kadena dApps.

This package contains the e2e tests and source code all Kadena dApps

## Table of Contents

- [Table of Contents][1]
- [Installation & Usage][2]

## Installation & Usage

### Projects

To execute the tests, the system under test needs to be running. Each of the
project configuration files contain all the required configuration to do this
for you. If you already have a server running locally, Playwright will attempt
to re-use the existing server, otherwise it will execute the provided start
command.

The following projects are currently being supported:

- [@kadena/docs][3]
- [@kadena/graph][4]
- [@kadena/tools][5]

Graph and Tools both depend on [Devnet][6]

#### Known Caveats:

- NextJS does not allow environment variables to be overwritten runtime, meaning
  for NextJS Apps the `dev` command is used.
- if .env file is present it will be used automatically by the webserver, just
  like when you would normally start the server.

### Devnet

Each project might have different requirements for devnet.

- Graph needs additional migrations for chainwebdata. Start devnet using the
  `pnpm run devnet` command from the graph package.
- Tools needs to deploy the faucet on devnet in order to run tests. This is
  something the test framework can do for you automatically.

A basic docker run command to start devnet can be found below.
`docker run -it --rm -p 127.0.0.1:8080:8080 kadena/devnet`

Note: the following commands have been written to be executable from the root of
the monorepository.

### Executing Tests

1. Install dependencies, build the monorepo:

```sh
pnpm install
pnpn turbo build
```

2. Install browsers required by Playwright

```sh
pnpm --filter @kadena-dev/e2e-tests run install:chromium
```

3. Starting tests

Graph:

```sh
pnpm turbo test:e2e -- -c playwright.graph.config.ts
```

Tools

```sh
pnpm turbo test:e2e -- -c playwright.tools.config.ts
```

Docs

```sh
pnpm turbo test:e2e -- -c playwright.docs.config.ts
```

### Debugging Tests

Playwright offers various ways of debugging the tests, you can do this by

- installing the [Playwright vscode extension][7], setting breakpoints and
  debugging your test in your IDE.
- Starting the test(s) in [UI Mode][8] by appending --ui flag the your run
  command.
- Starting the tests in debug mode by appending the --debug flag to your run
  command

All of these methods generally allow you debug in a similar manner and it's
personal preference which you might use.

[1]: #table-of-contents
[2]: #installation-#-usage
[3]: playwright.docs.config.ts
[4]: playwright.graph.config.ts
[5]: playwright.tools.config.ts
[6]: #devnet
[7]: https://playwright.dev/docs/getting-started-vscode
[8]: https://playwright.dev/docs/test-ui-mode#opening-ui-mode

dummy change
