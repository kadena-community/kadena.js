# Contributing to Kadena.js

## Table Of Contents

- Development
- Tests
- Making a Pull Request
- Conventions
- Publishing Packages

Do you want to file a bug? Please [open a new issue][1].

## Development

[Install Node.js][2] if you haven't already.

As an external contributor, you will need to fork the repo before you can
contribute. Then you can clone the repository and install dependencies:

```sh
git clone git@github.com:kadena-community/kadena.js.git
cd kadena.js
pnpm install
pnpm build
```

### Switch branches

Depending on the changes, you may need to invoke the following commands when
switching branches to keep everything in check:

```sh
pnpm install
pnpm build --filter <package name>
```

## Tests

```sh
pnpm test               # Run all tests, or inside package directory
pnpm run test --watch   # Keep running tests during development
```

## Making a Pull Request

Before making a pull request, please discuss your ideas first.

TODO

## Conventions

### Git/GitHub

- Try to keep pull requests focused and small.
- Use prefixed branch names such as `feat/feature-title`, `fix/fix-title`,
  `chore/chore-title`
- Using Asana? [Attach a pull request to the Asana task][3].
- Before merging a pull request, make sure the commit messages are good.
- Prefer a rebase over merge commits, for both [updating branches][4] and
  [merging pull requests][5].

### Code

This repository uses a combination of TypeScript, ESLint and Prettier to adhere
to coding standards. We try to automate and auto-fix as much as possible using
the following commands:

```sh
pnpm build   # Compile & build (using TypeScript)
pnpm lint    # Lint (and fix) (using ESLint)
pnpm format  # Format (using Prettier)
```

Run from root to apply to all packages, use `--filter` for a selection, and run
from any package folder to apply it only there.

For everything else, please discuss.

## Workflow

You are expected to install your own workflow the way you like it. For example,
some developers like to auto-format code "on save", others before they commit or
push their changes. That's why this repository does not auto-install Git hooks.

## Publishing Packages

To publish a new version of updated packages, please make sure you:

- are part of the `@kadena` npm organization
- have push rights to this repository's `main` branch
- are on a clean `main` branch

TODO

[1]: https://github.com/kadena-community/kadena.js/issues/new/choose
[2]: https://nodejs.org/en/download/package-manager
[3]: https://asana.com/guide/help/api/github#gl-key
[4]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch
[5]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request
