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

To run the tests locally, it is assumed that the dApp is served on
[http://localhost:3000][3]. For more information on how to achieve this, consult
the readme for the respective dApp. Running the tests locally can be achieved by
executing the commands below.

Note: the following commands have been written to be executable from the root of
the monorepository.

1.  Install dependencies:

```sh
pnpm install
```

2.  Install browsers required by Playwright

```sh
pnpm --filter @kadena-dev/e2e-tests run install:chromium
```

3.  Run test suite, substitute `tools-app` for any of the available projects
    described in the [playwright.config.ts][4]

```sh
 pnpm --filter @kadena-dev/e2e-tests run test:e2e --project=tools-app
```

[1]: #table-of-contents
[2]: #installation-#-usage
[3]: http://localhost:3000
[4]: ./playwright.config.ts
