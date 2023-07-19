# Migration notes

## What & Why

This monorepo is managed using Rush. The tool is opinionated and may work well
for certain projects and teams, yet it's not performing to our standards and
needs (which is also opinionated, lol). The main issue is that it's basically a
framework in front of everything. A framework works well, until it doesn't.

Let's follow widely used standards and the Unix philosophy a bit more: pick the
right tool for each job separately. So we can update and swap out tools
separately as the ~~trend~~ need arises.

## What jobs?

- Build and test packages
- Format and lint source code
- Cache results of builds and tests to save time and resources
- Build and test packages, and only those affected in a pull request
- Publish packages
- Dependency management, e.g. to fixate versions of dependencies across packages

## But how?

- `pnpm` does a lot out of the box already
- [turborepo][1] seems great for caching and "affected packages" logic
- [changesets][2] seems great for changelogs and publishing

## Guide

- Use more standards where possible, e.g. leverage `"private": true` for
  packages that should not be published.
- Commands are run through the package manager (npm, pnpm, ...) based on the
  standardized `package.json#scripts`. When we replace a tool the commands don't
  change. You _can_ run `turbo build` instead of `pnpm build`, but that's on
  you.

## TODO

- [ ] Find out wat heft/rigs actually do for us
- [ ] Look into version policies (e.g. to "group" packages)
- [ ] Enforce fixed version across monorepo for certain/all dependencies
- [ ] Fix build of `@kadena/client-examples`
- [x] Implement alternative to [packageTable.ts][3]
- [ ] Propose flat `packages/*` structure

## Misc.

```sh
pnpm run test --filter @kadena/react-ui
pnpm run build --filter @kadena/client-examples
pnpm -r run "/^format:(md|pkg|src)/"
```

```sh
pnpm recursive list --json | jq --arg cwd "$PWD" '[ .[] | { name, version, private, path: (.path | sub("^" + $cwd + "/"; "")) } ]' > workspace.json
```

[1]: https://turbo.build
[2]: https://github.com/changesets/changesets
[3]: packages/tools/remark-plugins/src/commentMarkers/packageTable.ts
