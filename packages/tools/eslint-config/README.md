<!-- genericHeader start -->

# @kadena-dev/eslint-config

Kadena monorepo eslint-config

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Usage

```sh
pnpm add -D @kadena-dev/eslint-config
```

Use an ESLint config file like `.eslintrc.js` in the root of your package and
refer to this `@kadena-dev/eslint-config` package with a profile:

```js
// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  parserOptions: { tsconfigRootDir: __dirname },
};
```
