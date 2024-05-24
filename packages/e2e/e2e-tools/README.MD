# E2E-tools

## Table of Contents

1. [Table of Contents][1]
2. [Installation & Usage][2]
3. [Installing external dependencies][3]
4. [Building e2e-base dependencies][4]
5. [Building SUT with test environment variables][5]
6. [Installing required browser][6]
7. [Kadena Sandbox][7]
8. [Executing tests][8]
9. [Debugging tests][9]

## Installation & Usage

### Installing external dependencies

For the sake of completeness, it is required to execute `pnpm install` to ensure
all external dependencies are installed.

### Building e2e-base dependencies

In order to run tests, we first need to build the dependencies for the
@kadena-dev/e2e-base package. You will have most likely done this if you've
recently executed `pnpm turbo build` but just in case you've not done this, the
quickest way to build this package is by executing
`pnpm turbo build --filter @kadena-dev/e2e-base^...`. This will only build the
required dependencies of the e2e-base package.

### Building SUT with test environment variables

Currently, NextJS requires env variables to be set at build time when using
`next start`. In order to do this, NextJS states a `.env.test` should be added
and the `NODE_ENV` should be set to test. To mitigate any weird side-effects, a
build script has been added to each app to build _just the app_ with
NODE_ENV=test, while all dependencies are built without explicitly setting the
variable. an `.env.test` has been added to each app, describing the required
environment variables if any are needed.

to build the App, execute `pnpm turbo build:e2e --filter @kadena/tools`

### Installing required browser

Playwright pins browser versions to make builds reproducable, to install these
execute the following command `pnpm --filter e2e-tools run install:chromium`

### Kadena Sandbox

Graph requires the Kadena Devnet sandbox to be running. The easiest way to start
this is by navigating to the (from the root of the monorepo)
`.github/actions/sandbox/ ` directory and executing the `docker compose up`
command.

### Executing tests

As tools does not have any direct external applications it depends on, you can
then execute the tests using the following command:
`pnpm turbo test:e2e --filter e2e-tools`

Playwright will check if any app is running on port 3000, if there is, we assume
you've started the app manually using `pnpm --filter @kadena/tools run start`.
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
[6]: #installing-required-browser
[7]: #kadena-sandbox
[8]: #executing-tests
[9]: #debugging-tests
[10]: https://playwright.dev/tools/getting-started-vscode
[11]: https://playwright.dev/tools/test-ui-mode#opening-ui-mode
