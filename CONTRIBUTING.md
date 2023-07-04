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
npm install --global @microsoft/rush
```

As an external contributor, you will need to fork the repo before you can
contribute. Then you can clone the repository and install dependencies:

```bash
git clone git@github.com:kadena-community/kadena.js.git
cd kadena.js
rush install
rush build
```

Make sure to read some of the Rush documentation, specifically the "Developer
tutorials" such as:

- [Getting started as a developer][3]
- [Everyday Rush commands][4]
- [Other helpful commands][5]

### Switch branches

Depending on the changes, you may need to invoke the following commands when
switching branches to keep everything in check:

```bash
rush update
rush build -t <package name>
```

## Tests

```bash
rush test       # Run all tests
rushx test      # Run only tests inside a package directory
rushx test -w   # Keep running tests during development
```

## Making a Pull Request

Before making a pull request, please discuss your ideas first.

Make sure to update the changelog before it gets merged:

```bash
rush change
```

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
rush build   # Compile & build all packages (using TypeScript)
rush lint    # Lint (and fix) all packages (using ESLint)
rush format  # Format all packages (using Prettier)
```

Use `rushx` instead of `rush` to do the same for only the current package.

For everything else, please discuss.

## Publishing Packages

To publish a new version of updated packages, please make sure you:

- are part of the `@kadena` npm organization
- have push rights to this repository's `main` branch
- are on a clean `main` branch

Follow these steps to publish the updated packages:

- Build and test from root
- Bump the version
- Publish updated packages

```bash
rush build
rush test
rush version --bump -b main
rush publish --apply --publish --include-all --add-commit-details --set-access-level public --target-branch main
```

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
