---
title: Prerequisites
description: Kadena makes blockchain work for everyone.
menu: Prerequisites
label: Prerequisites
order: 1
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript,typescript,signing,transaction,typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---
# Prerequisites

To use `@kadena/client`, Node.js v14 or higher is required. Let's install the
bare minimum you need to get started:

```sh
mkdir my-dapp-with-kadena-client
cd my-dapp-with-kadena-client
npm init -y
npm install @kadena/client
npm install --save-dev @kadena/pactjs-cli typescript ts-node
npx tsc --init
```
