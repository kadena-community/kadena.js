# Releasing wth Changesets

## Process overview

### Adding changesets

Changesets makes releasing our products easier, although it might not always be
clear how the process works. This document aims to explain the process and
document known caveats.

When creating a PR, a workflow `ci-changelog`[1] will run. This will determine
whether a changeset is present in the `.changeset`[2] folder. If it finds none,
this workflow will fail requesting you to add a changeset. From this point
forward there are two possible scenario's:

1. You want to perform a version bump for your package
2. You do _not_ want to perform a version bump for your package

For 1. run the command `changeset add` and a CLI will present you with changed
packages. Follow the CLI steps to select the desired version bump. This will add
a changeset in the `.changeset`[2] folder with your version bump and description
of the change.\
For 2. run the command `changeset add --empty` which will add an empty changeset
in the `.changeset`[2] folder.\
This means there will be no version bump and release to NPM

After merging your branch to main, the `ci-changelog`[1] will run again on main
and detect a changeset. This will trigger the workflow to create a branch called
`changeset-release/main` and a PR called `[ci] Release`

### Publishing packages

Releasing a package is as easy as gathering the required approvals for the
`[ci] Release` pull request.

### Known caveats

Publishing will _only_ be done when there are no changesets left in the
`.changeset`[2] folder. Consider the following situation. _Person A_ creates a
PR for `@kadena/client` and adds a valid changeset and merges their PR to main.
This leads to the `[ci] Release` pull request in which the

- `.changeset`[2] folder is emptied
- Changelogs are updated for the relevant packages
- Versions are updated in the package(s).json

Before _Person A_ has been able to merge the `[ci] Release` pull request to
trigger a publish, _Person B_ has merged a new feature for `@Kadena/tools` to
main which includes a changeset. The `ci-changelog`[1] will run again on main
and detect a changeset. This will trigger the workflow to create a new branch
called `changeset-release/main` and a new PR called `[ci] Release` instead or
publishing your packages.

Theoretically, if new changesets are added quick enough this loop can continue
for a long time. When there is time pressure to publish a (new) package it's
probably best to do the following:

1. Block merging to main through GitHub
2. Request developers not to merge to main

[1]: ../.github/workflows/ci-changelog.yml
[2]: ../.changeset/
