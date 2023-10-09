---
title: Usage
description: Kadena makes blockchain work for everyone.
menu: Usage
label: Usage
order: 2
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainweb-stream-client/README.md
layout: full
tags: [chainweb,stream,reference]
lastModifiedDate: Wed, 02 Aug 2023 07:22:41 GMT
---
# Usage

```js
import ChainwebStreamClient from '@kadena/chainweb-stream-client';

const client = new ChainwebStreamClient({
  network: 'mainnet01',
  type: 'event',
  id: 'coin',
  host: 'http://localhost:4000/',
});

client.on('confirmed', (txn) => console.log('confirmed', txn));

client.connect();
```

Find more detailed examples under `src/examples`.
