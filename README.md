# Welcome to Kadena.js

This monorepo contains libraries and tooling for frontend development.

<picture>
  <source srcset="./common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="./common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

## Support

- [Kadena Documentation][1]
- [Kadena on Discord][2]
- [Kadena on Stack Overflow][3]

## Contributing

New contributors are welcome! If you're interested, please see [our guide to
contributing][4].

## Getting started

First, you need to have `rush` (the monorepo manager tool) installed. You can
use your preferred package manager to do so.

```sh
npm install --global @microsoft/rush
# or
pnpm install --global @microsoft/rush
# or
yarn install --global @microsoft/rush
```

To run a specific package in the monorepo, install its relevant packages, and
build itself and its dependencies. You can omit `-t <package-name>` if you want
to `install` and `build` all packages.

```sh
rush install -t <package-name>
rush build -t <package-name>
```

Navigate to the relevant package and read the `README.md` on how to "Getting
Started" for that packages.

You can read all commands for that package by opening the `package.json`. In
order to get the right dependencies and references, use `rushx` to start the
`package.json#scripts`-commands.

```sh
# for example
cd packages/apps/docs && rushx dev
```

If you experience issues with the monorepo, please take a look at
[contribution guide > Fixing monorepo issues](./CONTRIBUTING.md#fixing-monorepo-issues)

## Packages

Overview of the main packages maintained in this repository:

<!--packageTable start -->

| Package                              | Release Notes        |
| :----------------------------------- | :------------------- |
| [@kadena/types][5]                   | [![version][7]][6]   |
| [@kadena/pactjs-generator][8]        | [![version][10]][9]  |
| [@kadena/pactjs-cli][11]             | [![version][13]][12] |
| [@kadena/pactjs][14]                 | [![version][16]][15] |
| [@kadena/cryptography-utils][17]     | [![version][19]][18] |
| [@kadena/client][20]                 | [![version][22]][21] |
| [@kadena/chainweb-stream-client][23] | [![version][25]][24] |
| [@kadena/chainweb-node-client][26]   | [![version][28]][27] |
| [@kadena-dev/rush-fix-versions][29]  | [![version][31]][30] |
| [@kadena-dev/heft-rig][32]           | [![version][34]][33] |
| [@kadena-dev/eslint-plugin][35]      | [![version][37]][36] |
| [@kadena-dev/eslint-config][38]      | [![version][40]][39] |

<!--packageTable end -->

## Contributors

Special thanks to the wonderful people who have contributed to this project:

[![Contributors][42]][41]

[1]: https://docs.kadena.io
[2]: https://discord.io/kadena
[3]: https://stackoverflow.com/questions/tagged/kadena
[4]: ./CONTRIBUTING.md
[5]: https://github.com/kadena-community/kadena.js/tree/main/packages/libs/types
[6]: ./packages/libs/types/CHANGELOG.md
[7]: https://img.shields.io/npm/v/@kadena/types.svg
[8]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/pactjs-generator
[9]: ./packages/libs/pactjs-generator/CHANGELOG.md
[10]: https://img.shields.io/npm/v/@kadena/pactjs-generator.svg
[11]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/pactjs-cli
[12]: ./packages/tools/pactjs-cli/CHANGELOG.md
[13]: https://img.shields.io/npm/v/@kadena/pactjs-cli.svg
[14]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/pactjs
[15]: ./packages/libs/pactjs/CHANGELOG.md
[16]: https://img.shields.io/npm/v/@kadena/pactjs.svg
[17]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/cryptography-utils
[18]: ./packages/libs/cryptography-utils/CHANGELOG.md
[19]: https://img.shields.io/npm/v/@kadena/cryptography-utils.svg
[20]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/client
[21]: ./packages/libs/client/CHANGELOG.md
[22]: https://img.shields.io/npm/v/@kadena/client.svg
[23]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-stream-client
[24]: ./packages/libs/chainweb-stream-client/CHANGELOG.md
[25]: https://img.shields.io/npm/v/@kadena/chainweb-stream-client.svg
[26]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/libs/chainweb-node-client
[27]: ./packages/libs/chainweb-node-client/CHANGELOG.md
[28]: https://img.shields.io/npm/v/@kadena/chainweb-node-client.svg
[29]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/rush-fix-versions
[30]: ./packages/tools/rush-fix-versions/CHANGELOG.md
[31]: https://img.shields.io/npm/v/@kadena-dev/rush-fix-versions.svg
[32]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/heft-rig
[33]: ./packages/tools/heft-rig/CHANGELOG.md
[34]: https://img.shields.io/npm/v/@kadena-dev/heft-rig.svg
[35]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/eslint-plugin
[36]: ./packages/tools/eslint-plugin/CHANGELOG.md
[37]: https://img.shields.io/npm/v/@kadena-dev/eslint-plugin.svg
[38]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/eslint-config
[39]: ./packages/tools/eslint-config/CHANGELOG.md
[40]: https://img.shields.io/npm/v/@kadena-dev/eslint-config.svg
[41]: https://github.com/kadena-community/kadena.js/graphs/contributors
[42]: https://contrib.rocks/image?repo=kadena-community/kadena.js
