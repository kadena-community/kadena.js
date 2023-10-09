---
title: Install
description: Kadena makes blockchain work for everyone.
menu: Install
label: Install
order: 1
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/tools/kda-cli/README.md
layout: full
tags: [javascript,typescript,kda,chainweaver,setup devnet,cli,client]
lastModifiedDate: Mon, 11 Sep 2023 07:19:36 GMT
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
# if you are using NVM, you should have this environment variable available
ln -s $(pwd)/bin/kda.js $NVM_BIN/kda
# if not, you can replace $NVM_BIN to any path you have added in your $PATH
```
