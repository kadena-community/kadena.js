---
title: Constructor Options
description: Kadena makes blockchain work for everyone.
menu: Constructor Options
label: Constructor Options
order: 3
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainweb-stream-client/README.md
layout: full
tags: [chainweb,stream,reference]
lastModifiedDate: Wed, 02 Aug 2023 07:22:41 GMT
---
# Constructor Options

| Key               | Required | Description                                                     | Example Values          |           |       |
| ----------------- | :------: | --------------------------------------------------------------- | ----------------------- | --------- | ----- |
| network           |   Yes    | Chainweb network                                                | \`mainnet01             | testnet04 | ...\` |
| type              |   Yes    | Transaction type to stream (event/account)                      | \`event                 | account\` |       |
| id                |   Yes    | Account ID or module/event name                                 | `k:abcdef01234..`       |           |       |
| host              |   Yes    | Chainweb-stream backend URL                                     | `http://localhost:4000` |           |       |
| limit             |    No    | Initial data load limit                                         | 100                     |           |       |
| connectTimeout    |    No    | Connection timeout in ms                                        | 10\_000                  |           |       |
| heartbeatTimeout  |    No    | Stale connection timeout in ms                                  | 30\_000                  |           |       |
| maxReconnects     |    No    | How many reconnections to attempt before giving up              | 5                       |           |       |
| confirmationDepth |    No    | How many confirmations for a transaction to be considered final | 6                       |           |       |
