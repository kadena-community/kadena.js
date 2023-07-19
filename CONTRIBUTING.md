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

```bash
git clone git@github.com:kadena-community/kadena.js.git
cd kadena.js
pnpm install
pnpm build
```

### Switch branches

Depending on the changes, you may need to invoke the following commands when
switching branches to keep everything in check:

```bash
pnpm install
pnpm build --filter <package name>
```

## Tests

```bash
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
- Using Asana? [Attach a pull request to the Asana task][6].
- Before merging a pull request, make sure the commit messages are good.
- Prefer a rebase over merge commits, for both [updating branches][7] and
  [merging pull requests][8].

### Code

This repository uses a combination of TypeScript, ESLint and Prettier to adhere
to coding standards. We try to automate and auto-fix as much as possible using
the following commands:

```bash
pnpm build   # Compile & build all packages (using TypeScript)
pnpm lint    # Lint (and fix) all packages (using ESLint)
pnpm format  # Format all packages (using Prettier)
```

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
[3]: https://rushjs.io/pages/developer/new_developer/
[4]: https://rushjs.io/pages/developer/everyday_commands/
[5]: https://rushjs.io/pages/developer/other_commands/
[6]: https://asana.com/guide/help/api/github#gl-key
[7]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch
[8]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request
