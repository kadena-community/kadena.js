---
title: Example Values
description: Kadena makes blockchain work for everyone.
menu: Example Values
label: Example Values
order: 1
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainwebjs/README.md
layout: full
tags: [chainweb,javascript,typescript,stream]
lastModifiedDate: Mon, 10 Jul 2023 09:00:36 GMT
---
# Example Values

Example of a block object:

```javascript
{
  header: {
    creationTime: 1617709987033643,
    parent: 'xv73bXWz1gnrqTisA_gPk1uQsAB5mbpcc1K28hbc1-g',
    height: 1510411,
    hash: 'uq_j7n0Oi_kn_MOCzCnab5ceJoTh1107ovP6sEupL_g',
    chainId: 14,
    weight: 'ANTVgl6hNGp2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    featureFlags: 0,
    epochStart: 1617707264590744,
    adjacents: {
      '4': 'QjY3cD3SI3ZXFLJSEBs9vQ4inE6kttzloHr7Xw7Jb1Q',
      '13': 'pVCx1m9vdwkUuL2IY1a4YFH5pR26LYuDlvTB5EET1lc',
      '15': 'suYkkMMTC91ezPrL0lWPJfb4jMdPwDrAZ5QDbTHa094'
    },
    payloadHash: 'uRNlKTYUX8le57PUU7PegH6R4sQ_BRcbyM_8X0SmqGU',
    chainwebVersion: 'mainnet01',
    target: 'HaIMMhav3qFjTsesHlofQs1qXtA03KwCoAkAAAAAAAA',
    nonce: '5090157328105015810'
  },
  payload: {
    transactions: [],
    minerData: {
      account: '6d87fd6e5e47185cb421459d2888bddba7a6c0f2c4ae5246d5f38f993818bb89',
      predicate: 'keys-all',
      'public-keys': [Array]
    },
    transactionsHash: 'PZA7NIdgDatkTRZ8AOSI7dOOJzhGAhe7JkovnMp1xks',
    outputsHash: 'RJVkqVIwW2U6na2pExx866Ld_q2Hw0ZxHC_PScDpsZo',
    payloadHash: 'uRNlKTYUX8le57PUU7PegH6R4sQ_BRcbyM_8X0SmqGU',
    coinbase: {
      gas: 0,
      result: [Object],
      reqKey: 'Inh2NzNiWFd6MWducnFUaXNBX2dQazF1UXNBQjVtYnBjYzFLMjhoYmMxLWci',
      logs: 'NI1wv5IbNktRCAQXB4NNuiZHqzyvhjXIrndkgEGLtUg',
      metaData: null,
      continuation: null,
      txId: 671318
    }
  }
}
```

Example of a transaction object:

```javascript
{
  transaction: {
    hash: 'h2oKMgCpT_QOGLL-vZj59gCn9bvp7_UW3_tufsJM_-c',
    sigs: [ [Object] ],
    cmd: {
      networkId: 'mainnet01',
      payload: [Object],
      signers: [Array],
      meta: [Object],
      nonce: '"\\"2021-04-06T19:03:18.773Z\\""'
    }
  },
  output: {
    gas: 392,
    result: { status: 'success', data: [Object] },
    reqKey: 'h2oKMgCpT_QOGLL-vZj59gCn9bvp7_UW3_tufsJM_-c',
    logs: 'Go2w3KEnTqjgry8l5ucz2u3nmVGJN6sEdxI6YGiTF7Q',
    metaData: null,
    continuation: {
      executed: null,
      pactId: 'h2oKMgCpT_QOGLL-vZj59gCn9bvp7_UW3_tufsJM_-c',
      stepHasRollback: false,
      step: 0,
      yield: [Object],
      continuation: [Object],
      stepCount: 2
    },
    txId: 2026960
  },
  height: 1511402
```

Example of an event object:

```javascript
{
  params: [
    '4677a09ea1602e4e09fe01eb1196cf47c0f44aa44aac903d5f61be7da3425128',
    'f6357785d8b147c1fac66cdbd607a0b1208d62996d7d62cc92856d0ab229bea2',
    10462.28
  ],
  name: 'TRANSFER',
  module: { namespace: null, name: 'coin' },
  moduleHash: 'ut_J_ZNkoyaPUEJhiwVeWnkSQn9JT9sQCWKdjjVVrWo',
  height: 1511601
}
```

[1]: https://kadena.io

[2]: https://api.chainweb.com
