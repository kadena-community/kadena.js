# Contributing to Kadena.js

## Table Of Contents

- Development
- Tests
- Making a Pull Request
- Conventions
- Publishing Packages

Do you want to file a bug? Please [open a new issue][1].

## Development

[Install Node.js][2] if you haven't already. Then install Rush:

```bash
pnpm install --global @microsoft/rush
```

As an external contributor, you will need to fork the repo before you can
contribute. Then you can clone the repository and install dependencies:

```bash
git clone git@github.com:kadena-community/kadena.js.git
cd kadena.js
rush install
rush build
```

Also see the Rush guide on [Getting started as a developer][4].

Each package has its own instructions to start development. See the package
directory for more information.

## Tests

```bash
rush test       # Run all tests
rushx test      # Run only tests inside a package directory
rushx test -w   # Keep running tests during development
```

## Making a Pull Request

Before making a pull request, please discuss your ideas first.

Make sure to generate the changelog before it gets merged:

```bash
rush change
```

## Conventions

This repository uses a combination of TypeScript, ESLint and Prettier to adhere
to coding standards. We try to automate and auto-fix as much as possible using
the following commands:

```bash
rush build   # Compile & build all packages (using TypeScript)
rush lint    # Lint (and fix) all packages (using ESLint)
```

Use `rushx` to do the same for only the current package.

For everything else, please discuss.

## Publishing Packages

To publish a new version of updated packages, please make sure you:

- are part of the `@kadena` npm organization
- have push rights to this repository's `master` branch
- are on a clean `master` branch

Follow these steps to publish the updated packages:

- Build and test from root
- Bump the version
- Publish updated packages

```bash
rush build
rush test
rush version --bump -b master --ignore-git-hooks
rush publish --apply --publish --include-all --add-commit-details --set-access-level public --target-branch master
```

[1]: https://github.com/kadena-community/kadena.js/issues/new/choose
[2]: https://nodejs.org/en/download/package-manager
[3]: https://pnpm.io/installation
[4]: https://rushjs.io/pages/developer/new_developer/
