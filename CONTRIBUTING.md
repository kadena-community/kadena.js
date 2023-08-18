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

When switching branches external- (npm) and monorepo-dependencies might have
changed. Run the following command to update both:

```sh
rush install
rush build
# or to install and build for a specific package
rush install -t <package>
rush build -t <package>
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

## Fixing monorepo issues

### Package or type not found

When compiling, either locally or in Github CI, an issue with `type not found`
could occur. To make sure it's not an issue with your code check the following.

- is the dependency present in the packages' `package.json`
- did you run `rush install`
- did you run `rush build -t <package-to-work-on>`, or `rush build` to build all
  packages
- try `rush rebuild`, this will build regardless of any caching mechanisms
- remove all non-tracked files and folders, and rebuild. Make sure to backup
  `.env` and other files that you want to preserve
  ```sh
  cd packages && git clean -dfx .
  rush install && rush rebuild
  # or only specifically for a package
  rush install -t <package> && rush rebuild -t <package>
  ```

### PR has conflicts with main

1. run `git fetch && git rebase origin/master`. This will update the status of
   the remote branches and then rebase your current branch on `master`
   1. you get conflicts in either `repo-state.yaml` or `pnpm-lock.json`.  
      run `rush update` to update those two files according to the packages'
      dependencies
   2. fix your other conflicts manually

### Github Actions CI build is red, locally it works

This could be an issue where you're depending on local caches or locally built
projects that aren't up-to-date with master

1. go into the `packages` directory and clear all non-committed files
   ```sh
   cd packages && git clean -dfx .
   ```
2. install packages and build and test the project. Use `rush rebuild` to bypass
   caches
   ```sh
   rush install && rush rebuild && rush test
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

## Workflow

You are expected to install your own workflow the way you like it. For example,
some developers like to auto-format code "on save", others before they commit or
push their changes. That's why this repository does not auto-install Git hooks.

If you want to make sure you don't forget to update the changelog before you
push code, here's an example to install a Git hook for that:

```bash
echo "rush change --verify" > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

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
