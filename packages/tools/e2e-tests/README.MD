<!-- genericHeader start -->

# @kadena-dev/e2e-tests

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

### dApp

In order to run the tests, the dApp needs to be running on
[http://localhost:3000][3]. The tests will assume you deployed the dApp yourself
if a webserver is found on [http://localhost:3000][3]. if it is unable to find
one, the test framework will attempt to start the dApp for you. it is
recommended that you first execute a build of the monorepo to ensure performance
of the dev server.

### Devnet

In order to run these integrated tests, a version of devnet is also required.
`docker run -it --rm -p 127.0.0.1:8080:8080`

Once these two components have been started, either by you or the

Note: the following commands have been written to be executable from the root of
the monorepository.

1. Install dependencies, build the monorepo:

```sh
pnpm install
pnpn turbo build
```

2. Install browsers required by Playwright

```sh
pnpm --filter @kadena-dev/e2e-tests run install:chromium
```

3. Run test suite, substitute `tools` for any of the available Apps. Each App
   has it's own config file.

```sh
 pnpm --filter @kadena-dev/e2e-tests run test:e2e -c playwright.tools.config.ts
```

[1]: #table-of-contents
[2]: #installation-#-usage
[3]: http://localhost:3000
