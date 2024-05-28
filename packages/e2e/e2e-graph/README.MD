# E2E-graph

## Table of Contents

1. [Table of Contents][1]
2. [Installation & Usage][2]
3. [Installing external dependencies][3]
4. [Building e2e-base dependencies][4]
5. [Building SUT with test environment variables][5]
6. [Kadena Sandbox][6]
7. [Executing tests][7]
8. [Debugging tests][8]

## Installation & Usage

### Installing external dependencies

For the sake of completeness, it is required to execute `pnpm install` to ensure
all external dependencies are installed.

### Building e2e-base dependencies

In order to run tests, we first need to build the dependencies for the
@kadena-dev/e2e-base package. You will have most likely done this if you've
recently executed `pnpm turbo build` but just in case you've not done this, the
quickest way to do this is by executing
`pnpm turbo build --filter @kadena-dev/e2e-base^...`. This will only build the
required dependencies of the e2e-base package.

### Building SUT with test environment variables

For Graph, no specific variables need to be set

to build the App, execute `pnpm turbo build --filter @kadena/graph`

### Kadena Sandbox

Graph requires the Kadena Devnet sandbox to be running. The easiest way to start
this is by navigating to the (from the root of the monorepo)
`.github/actions/sandbox/ ` directory and executing the `docker compose up`
command.

### Executing tests

As graph does not have any direct external applications it depends on, you can
then execute the tests using the following command:
`pnpm turbo test:e2e --filter e2e-graph`

Playwright will check if any app is running on port 3000, if there is, we assume
you've started the app manually using `pnpm --filter @kadena/graph run start`.
If nothing appears to be running, it will try to start the app for you using the
same command. Tests will be executed automatically afterwards.

### Debugging Tests

Playwright offers various ways of debugging the tests, you can do this by

- installing the [Playwright vscode extension][9], setting breakpoints and
  debugging your test in your IDE.
- Starting the test(s) in [UI Mode][10] by appending --ui flag the your run
  command.
- Starting the tests in debug mode by appending the --debug flag to your run
  command

All of these methods generally allow you debug in a similar manner and it's
personal preference which you might use.

[1]: #table-of-contents
[2]: #installation-#-usage
[3]: #installing-external-dependencies
[4]: #building-e2e-base-dependencies
[5]: #building-sut-with-test-environment-variables
[6]: #kadena-sandbox
[7]: #executing-tests
[8]: #debugging-tests
[9]: https://playwright.dev/graph/getting-started-vscode
[10]: https://playwright.dev/graph/test-ui-mode#opening-ui-mode
