---
title: Install
description: Kadena makes blockchain work for everyone.
menu: Install
label: Install
order: 1
editLink: undefined/packages/tools/kda-cli/README.md
layout: full
---
# Install

Note that the package is not yet published, so for now you need to clone this
repo and make a symlink.

```sh
$ npm install --global @kadena/kda-cli
```

### Install From repo

To install the executable from this repo:

```sh
pnpm install
pnpm build --filter @kadena/kda-cli
chmod +x ./lib/index.js
# if you are using NVM, you should have this environment variable available
ln -s $(pwd)/lib/index.js $NVM_BIN/kda
# if not, you can replace $NVM_BIN to any path you have added in your $PATH
```
