# Testing

This document attempts to provide an overview of all testing activites performed for the various packages in this repository as well as provide some general guidelines for specific categories. All of the below mentioned tests are integrated within CI pipelines. More detailed information on that setup can be found [here][1]

On a high level, the following testslevels are used:
- Unit tests
- Visual Regression tests (for components)
- Integration tests
- End-to-end tests.

Deciding which tests you need is never a clear cut answer. In almost all cases, carefully balancing the various test types you have available will provide a balance between effort, feedback and cost.  A commonly used approach is the ['Testing Trophy' by Kent Dodds][2]

## Apps

### Unit tests
The aim for all apps is to have 90% code coverage for statements, branches and functions. For each individual application it should be determined which parts of the package seem sensible to cover with unit tests. For the vast majority of our apps, UI code is explicitly ignored when calculating code coverage since these are largely composed of standardized components from the @kadena/kode-ui package.

The selected tool to use is Vitest, more information about the general Vitest setup can be found [here][3]. These tests do not depend on any external test objects

### End-to-end tests
Most of the apps within this monorepo connect to Kadena's blockchain in one way or another. Critical Business flows have been documented as E2E tests to ensure that all relevant test objects (app, smart contract and blockchain) can work together to support these flows.

The selected tool to use is Playwright. More information about the general setup can be found [here][4]. These tests depend on the smart contract being deployed as well as a blockchain instance. The test framework ensures that the required smart contracts are deployed before running tests by using setup projects. Starting a blockchain sandbox can be done by navigating to the `.github/actions/sandbox` folder and invoking `docker compose up`. This starts the sandbox up in the same way as the CI pipeline does. 

## Libraries
### Unit tests
Libraries have the same shared requirement of 90% code coverage for statements, branches and functions. Libraries can be used in both Kadena applications as well as non-kadena applications and have an inherently higher risk factor due to this. By default, all code in the `src` directory is used to measure code coverage. 

The selected tool to use is Vitest, more information about the general Vitest setup can be found [here][3]. These tests do not depend on any external test objects. Executing them is as simple as invoking the `test` script. 

### Integration tests
Most of our libraries provide developers easier ways to interact with Kadena's blockchain. Due to this, consumer facing and critical libraries have integration tests to verify whether or not the exposed features correctly interact with the blockchain. These tests depend on a running blockchain sandbox and in some cases, deployed smart contracts. Starting a blockchain sandbox can be done by navigating to the `.github/actions/sandbox` folder and invoking `docker compose up`. This starts the sandbox up in the same way as the CI pipeline does. In most cases these tests validate the interaction between one or more functions and the blockchain. For example, in client-utils there are various tests that validate the `transferCreate`

The selected tool to use is Vitest, more information about the general Vitest setup can be found [here][3]. These tests do not depend on any external test objects. Executing them is as simple as invoking the `test:integration` script.

### Visual Regression tests
This only applies to the `kode-ui` library. As most of our apps are based on Kode-UI, additional visual regression tests run whenver Kode-UI is changed to verify if components still look the same compared to the previous iteration. Chromatic is used for this

## Tools setup
### GitHub Actions
Pipelines have been setup to use [composite actions][5] for sets of actions that have been repeated over multiple job, an example of this is setting up tooling such als Node & pnpm. Integration Tests & end-to-end tests have been set up as a seperate job in order to efficiently use the available runners and resources. Putting them in a single job would instruct turbo to run as much in parallel as possible, this would decrease performance of these heavier tests significantly. 

#### Integration Tests
The integration tests have been set up as a matrix job. Running integration tests for a new package is as easy as updating the package array with newest addition. Note, due to issues with caching the test result currently, this pipeline is set up to bypass turbo and specifically run tests using `pnpm` instead of through turbo.

#### End-to-end tests
The end-to-end tests have been set up as a matrix job. Running tests for a new package is easy as updating the package array with the newest addition (you can ommit the `@kadena/` prefix). While this pipeline is fairly simple in it's set up here are a few important topics to take note of.

As most apps require specific environment variables in order to work with the sandbox blockchain instance. As these apps are mostly NextJS applications, each of them have a `.env.test` file committed to the repository and these apps are built with `NODE_ENV` set to `test`. This instructs NextJS to use the test environment file.  To prevent dependencis being built with the NODE_ENV set to test as well, each app has a `build:e2e` script that builds dependencies without touching the NODE_ENV and builds _just the app_ using the NODE_env set to test.

at the end of the test run, a report is generated and archived as part of the run results. This can be downloaded and the HTML report can be viewewd.

### Vitest

### Playwright

[1]: #github-actions
[2]: https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications
[3]: #vitest
[4]: #playwright
[5]: ../.github/actions/