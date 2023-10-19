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

### Troubleshooting

Running into issues? Please see if the issue has a solution in
[Troubleshooting][3].

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

Before making a pull request, please discuss your ideas first. This will
optimize your time and the review process.

## Conventions

### Git/GitHub

- Try to keep pull requests focused and small.
- Use prefixed branch names such as `feat/feature-title`, `fix/fix-title`,
  `chore/chore-title`
- Using Asana? [Attach a pull request to the Asana task][4].
- Before merging a pull request, make sure the commit messages are good.
- Prefer a rebase over merge commits, for both [updating branches][5] and
  [merging pull requests][6].

### Changelogs

#### Add a Changelog

When wrapping up a PR you should add one or more changelog entries:

```sh
pnpm changeset
```

Decide for each package wether the changes are relevant to the consumer of the
package(s) and how their version should be bumped (`patch`, `minor` or `major`).
You can edit the created Markdown file in the `.changeset` folder. Use `none` to
not bump the version at all.

Recommended reading: [Introducing Changesets: Simplify Project Versioning with
Semantic Releases][7]

#### Authoring Changelogs

To keep everything clear for ourselves and our end users, we have a "changelog
etiquette". Only include changes that affect the consumer of your
package/app/product. It's not a commit log. Write descriptions that are
understandable from the consumers' perspective:

- Start descriptions with action verbs like "Add", "Remove", "Deprecate", "Fix",
  "Improve", "Update".
- Avoid the term "bug", use "issue" instead.
- Add GitHub issue numbers when fixing those.
- When referring to public API changes, use backticks and parentheses for code
  like function names and classes (e.g. `createClient()`,
  `new TransactionBuilder()`, `hash`).
- Upgrades should be documented with old and new version numbers.
- Avoid trailing periods (unless in a description below the commit title).

Examples:

- Deprecate the `doSomething()` API function.
- Use `doSomethingBetter()` instead.
- Fix issue where `ExampleWidget` API did not handle dates correctly (fix #81)
- Improve the diagnostic logging when running in advanced mode.
- Upgrade from `react@15` to `react@16-beta` release of the flexible panels
  feature

(Credits: [rushjs.io/pages/best_practices/change_logs][8])

If you don't see a need for authoring changelogs for your package (e.g. a PoC or
packages without consumers), add it to [.changeset/config.json#ignore][9].

### Code

This repository uses a combination of TypeScript, ESLint and Prettier to adhere
to coding standards. We try to automate and auto-fix as much as possible using
the following commands:

```sh
pnpm build
pnpm lint
pnpm format
```

Note that lint and format are separated tasks (read more at [linting vs
formatting][10]).

Run from root to apply to all packages, use `--filter` for a selection, and run
from any package folder to apply it only there.

See [Filters][11] for more details.

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

We're using [Changesets][12] for our release process. The manual process in [How
do I run the version and publish commands?][13] is what we use and repeat here:

1. Check out and pull `main`
2. Update changelogs and bump versions
3. Create a new branch and open a "version bump" PR
4. Merge PR to `main`
5. Build and publish from `main`

```sh
git checkout main
git pull
git checkout -b chore/release-packages
pnpm changeset version
git commit -m "Update changelogs and bump versions"
git push
```

Create a pull request and get it merged to `main`. Then we can publish:

```sh
git checkout main
git pull
pnpm turbo build lint test --force
pnpm changeset publish # Use your npm OTP token
git push --tags
```

[1]: https://github.com/kadena-community/kadena.js/issues/new/choose
[2]: https://nodejs.org/en/download/package-manager
[3]: ./docs/troubleshooting.md
[4]: https://asana.com/guide/help/api/github#gl-key
[5]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch
[6]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request
[7]:
  https://lirantal.com/blog/introducing-changesets-simplify-project-versioning-with-semantic-releases/
[8]: https://rushjs.io/pages/best_practices/change_logs
[9]: .changeset/config.json
[10]: ./docs/lint-vs-format.md
[11]: ./docs/pnpm-turbo-filter.md
[12]: https://github.com/changesets/changesets
[13]:
  https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md#how-do-i-run-the-version-and-publish-commands
