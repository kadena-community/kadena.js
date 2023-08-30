# Filters

Both pnpm and Turborepo have a `--filter` argument.

**tl/dr;** Start commands with `pnpm run [cmd]` or `pnpm turbo [cmd]` to use
Turborepo and its filtering options. See their docs for all options and syntax:

- pnpm docs: [Filtering][1]
- Turborepo docs: [Filtering Workspaces][2]

## pnpm

To run the test script of a specific package(s), bypassing Turborepo entirely:

```sh
pnpm --filter <package_selector> <command>
```

These commands all do the same, the `--filter` argument is provided to `pnpm`:

```sh
pnpm --filter @kadena/client test
pnpm --filter @kadena/client run test
pnpm test --filter @kadena/client
pnpm run --filter @kadena/client test
```

## Turborepo

To use Turborepo, include dependencies of the target package and enjoy caching:

```sh
pnpm run test --filter @kadena/client
```

The `pnpm run test` makes sure the `test` script from the root `package.json`
are used. You can also execute the `turbo` executable directly to do the same:

```sh
pnpm turbo test --filter @kadena/client
pnpm turbo --filter @kadena/client test
```

## Bypass Turborepo cache

To force Turborepo to bypass the cache:

```sh
pnpm turbo build --force
```

[1]: https://pnpm.io/filtering
[2]: https://turbo.build/repo/docs/core-concepts/monorepos/filtering
