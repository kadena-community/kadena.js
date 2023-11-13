# Linting & Formatting

## Separation of Concerns

Linting and formatting has been separated in this monorepo. Here are two resources that explain why:

- [ESLint is deprecating formatting rules][1]
- [What About Formatting?][2]
- [Formatters, linters, and compilers: Oh my!][3] says:

> Don't use linters for formatting!
>
> Although lint rules can enforce some formatting preferences in code, they're slower, less
> consistent, and more prone to missing edge cases when compared to dedicated formatters.

Another reason is that it should be possible to replace either ESLint or Prettier without them being
too intermingled.

This separation of concerns leads to clearer objectives and faster execution. For example, if you
want to know whether your code is formatted properly you can do `pnpm lint` and get your answer
faster compared to doing everything at once.

With that in mind, this document describes some main aspects of the current setup.

## Prettier inside ESLint

What about `eslint-plugin-prettier` and `eslint-config-prettier`?

Confusingly perhaps, `eslint-plugin-prettier` loads and runs Prettier inside ESLint, while
`eslint-config-prettier` disables rules from core and other plugins. The latter is what we want and
the direction ESLint itself is going.

That's why we've removed `eslint-plugin-prettier`, and include only `eslint-config-prettier`.

## Scripts

_tl/dr; Use `pnpm format` for formatting and `pnpm lint` for linting._

When looking into the related scripts in `package.json` you'll find something like this:

```json
{
  "name": "@kadena/pkg",
  "scripts": {
    "format": "pnpm run --sequential /^format:.*/",
    "format:lint": "pnpm run lint:src --fix",
    "format:md": "remark README.md -o --use @kadena-dev/markdown",
    "format:src": "prettier . --cache --write",
    "lint": "pnpm run /^lint:.*/",
    "lint:fmt": "prettier . --cache --check",
    "lint:pkg": "lint-package",
    "lint:src": "eslint src --ext .js,.ts,.jsx,.tsx,.mjs"
  }
}
```

This might seem confusing or mixed up at first. Naming is hard! The naming of the scripts here is
mainly based on the fact that ESLint and Prettier do both formatting and linting:

- The `format:lint` script means "format using the linting rules" (using `eslint --fix`)
- The `lint:fmt` script means "check the formatting" (using `prettier --check`)

Note that formatting should happen sequentially to prevent race conditions during file writes, and
Prettier should have the last word here.

The `format:src` and `lint:src` are the usual suspects here. The common `format` and `lint` scripts
are reserved for convenience and run multiple other scripts, as we have more formatting and linting
solutions.

## Future

As long as `eslint --fix` formats code that Prettier doesn't, ESLint can't be ditched for
formatting. Prettier does have plugins that extends its formatting capabilities. We're already using
`prettier-plugin-packagejson`. It's good to keep moving into this direction and stay away from
ESLint for formatting whenever possible.

[1]: https://github.com/eslint/eslint/issues/17522
[2]: https://typescript-eslint.io/linting/troubleshooting/formatting/
[3]: https://github.com/readme/guides/formatters-linters-compilers
