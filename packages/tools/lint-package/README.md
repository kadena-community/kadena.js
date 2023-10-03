<!-- genericHeader start -->

# @kadena-dev/lint-package

Linter for monorepo packages

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Usage

```sh
pnpm add -D @kadena-dev/lint-package
```

```json
{
  "name": "@kadena/package",
  "scripts": {
    "lint": "pnpm run /^lint:.*/",
    "lint:pkg": "lint-package"
  },
  "dependencies": {},
  "devDependencies": {
    "@kadena-dev/lint-package": "workspace:*"
  }
}
```
