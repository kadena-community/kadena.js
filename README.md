# Kadena & Kadena.js

Kadena was founded on the idea that blockchain could revolutionize how the world
interacts and transacts. But to get to mass adoption, chain technology and the
ecosystem connecting it to the world needed to be reimagined from the ground up.
Our founders built a proprietary chain architecture and created the tools to
make blockchain work for everyone. – at speed, scale, and energy efficiency
previously thought unachievable.

Our ecosystem powers real-world use cases for enterprises and entrepreneurs,
providing the security of Bitcoin, virtually free gas (transaction fees),
unparalleled throughput, as well as Pact - a secure smart contract language with
built-in bug detection.

With such a revolutionary blockchain the community also needs the tools to
create products on this chain. Therefore, we started with Kadena.js. Kadena.js
is a Monorepo (mono repository) where we will store all our
JavaScript/TypeScript solutions for our blockchain (libs, tooling, dApps, and so
forth).

<p align="center">
  <picture>
    <source srcset="./common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
    <img src="./common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
  </picture>
</p>


<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->


# Kadena.js

Kadena.js is the source for several packages, tooling, and dapps that have any
affiliation with Front-end development.

At this moment Kadena.js will be the home of these packages (see also
[Definition of libraries in kadena.js](https://github.com/kadena-community/kadena.js/issues/42)):

- `@kadena/cryptography-utils` contains hash/sign utils
- `@kadena/chainweb-node-client` typed js wrapper with fetch to call
  chainweb-node API endpoints (amongst
  others [https://api.chainweb.com/openapi/pact.html](https://api.chainweb.com/openapi/pact.html)).
  This will probably have some breakdown
  - `api` one-to-one mapping of rest endpoints to typed js client
  - `utils` functions like that use the `api` functions to get information
- `@kadena/chainweb-data-client` typed js wrapper with fetch to call
  chainweb-data API endpoints
- `@kadena/pactjs-client` wrapper around chainweb-node-client with ability to
  switch environments etc.
- `@kadena/wallet-client` client for wallet to sign, connect, retrieve account
  info, etc
- `@kadena/marmalade-client` specific client for marmalade/NFTs
- `@kadena/types` common used typescript definitions. Preferably this will all
  move to the low-level libraries. Whenever you build something on top of those,
  you can use those types.
- =====
- `@kadena/pactjs` runtime for generating pact expressions
- `@kadena/pactjs-cli` cli to generate pact contract type definitions and
  interface to pact client. deployment of contracts, etc
- `@kadena/pactjs-generator` library that creates typescript definition from
  contract, template, etc
- `.kadena/pactjs-generated` library that does not exist on npm. It
  is *generated* by `@kadena/pactjs-cli` and `@kadena/pactjs-generator` and is a
  dependency of `@kadena/pactjs`
- `@kadena/transaction-templates` a supportive library for transactions. As
  there is no way to determine from pact alone which caps are needed for a given
  transaction, and in turn which signatures are needed, we want to provide the
  community a way to "publish" templates. These templates can be used
  by `@kadena/pactjs-cli` to generate the necessary typescript definitions

As our ecosystem will grow so will the packages and dapps we will release under
Kadena.js.

# Contributing

See CONTRIBUTING.md on how to contribute.

## Getting started

See [requirements](#requirements) to get started. After that come back here

- run `rush install` when you've cloned the project
- adding dependencies is done
  - with `rush add -p <package>` (add `--dev` if needed)
  - by adding it to the `package.json` and running `rush update` afterwards

If any issues occur, you can run `rush update --purge`

[Read more about Rush "New developer"](https://rushjs.io/pages/developer/new_developer/)

## Running tests

Run `rush test` to run all the available tests. To run the tests for a specific
project, run `rushx test` in the folder of the chosen project. You can also
watch the tests by running `rushx test -w`.

## Requirements

- node 16
- rushjs

See [installing prerequisites](#installing-prerequisites)

## Installing prerequisites

### Install `node`

several options, here used `n`. Can also use `asdf` (generic version manager),
`nvm`, or installation with `brew` (discouraged)

```sh
# `n` node version manager
brew install n
n 16
```

### Install `rush`

```sh
pnpm install --global @microsoft/rush
```

Now go to [getting started](#getting-started)

## How to publish

- You need to be added to the `@kadena` and `@kadena-dev` NPM organizations
  (depending on what you want to publish)
- You need to have push rights on master, as the version bump needs to be done
  against master (because of tags) (TODO: fix that this isn't necessary)
- PRs need to be merged to master with the appropriate changelogs and version
  policy (when using a sub 1.0.0 version, there cannot be any breaking changes
  in the changelog)
- On master
  - make sure to checkout master
  - stash all changes including untracked ones
  - run a build + test for the full monorepo
    - run the version bump command, this will be pushed to master (hence the
      push rights on master)
      - `rush version --bump -b master --ignore-git-hooks; rush publish --apply --publish --add-commit-details --set-access-level public --target-branch master`
    - run the publish command. This will require you to fill in 2FA tokens for
      every push for npm
      - `rush publish --apply --publish --include-all --add-commit-details --set-access-level public --target-branch master`

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.randynamic.com"><img src="https://avatars.githubusercontent.com/u/1035101?v=4?s=100" width="100px;" alt="Randy"/><br /><sub><b>Randy</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/commits?author=Randynamic" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/eileenmguo"><img src="https://avatars.githubusercontent.com/u/9022549?v=4?s=100" width="100px;" alt="eileenmguo"/><br /><sub><b>eileenmguo</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/commits?author=eileenmguo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ash-vd"><img src="https://avatars.githubusercontent.com/u/9663397?v=4?s=100" width="100px;" alt="Ashwin van Dijk"/><br /><sub><b>Ashwin van Dijk</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/commits?author=ash-vd" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sstraatemans"><img src="https://avatars.githubusercontent.com/u/4015521?v=4?s=100" width="100px;" alt="Steven"/><br /><sub><b>Steven</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/commits?author=sstraatemans" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://albertgroothedde.com"><img src="https://avatars.githubusercontent.com/u/516972?v=4?s=100" width="100px;" alt="Albert G"/><br /><sub><b>Albert G</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/pulls?q=is%3Apr+reviewed-by%3Aalber70g" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://andortang.wordpress.com"><img src="https://avatars.githubusercontent.com/u/1508400?v=4?s=100" width="100px;" alt="Andy Tang"/><br /><sub><b>Andy Tang</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/pulls?q=is%3Apr+reviewed-by%3AEnoF" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kate-hee-kyun-yun"><img src="https://avatars.githubusercontent.com/u/31594593?v=4?s=100" width="100px;" alt="Kate Hee Kyun Yun"/><br /><sub><b>Kate Hee Kyun Yun</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/commits?author=ggobugi27" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nillo"><img src="https://avatars.githubusercontent.com/u/1943024?v=4?s=100" width="100px;" alt="de-nial-lo"/><br /><sub><b>de-nial-lo</b></sub></a><br /><a href="https://github.com/kadena-community/kadena.js/commits?author=nillo" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
