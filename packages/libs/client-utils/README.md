<!-- genericHeader start -->

# @kadena/client-utils

Utility functions build as a wrapper around @kadena/client

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Kadena client utils

Introducing `@kadena/client-utils`, a library that aims to provide a
higher-level API for interacting with smart contracts. The library includes
helpers for the `coin` module, which can be imported using
`@kadena/client-utils/coin`. The library also exports utilities under `/core`
for smart contract developers to develop APIs, including some functions that can
be used for any kind of smart contracts.

- asyncPipe
- submitClient
- preflightClient
- dirtyReadClient
- crossChainClient

examples

```TS
import { getBalance, transferCrossChain } from "@kadena/client-utils/coin"
import { signWithChainweaver } from "@kadena/client"

const balance = await getBalance(
  accountOne.account,
  'development',
  '0',
  'http://localhost:8080',
 );

 const result = await createAccount(
  {
    account: 'javad',
    keyset: {
      pred: 'keys-all',
      keys: ['key-a', 'key-b'],
    },
    gasPayer: { account: 'gasPayer', publicKeys: [''] },
    chainId: '0',
  },
  {
    host: 'https://api.testnet.chainweb.com',
    defaults: {
      networkId: 'testnet04',
    },
    sign: signWithChainweaver,
  },
)
   // signed Tx
  .on('sign', (data) => console.log(data))
  // preflight result
  .on('preflight', (data) => console.log(data))
  // submit result
  .on('submit', (data) => console.log(data))
  // listen result
  .on('listen', (data) => console.log(data))
  .execute();
```

### Future work

- `npx create @kadena/client-utils`

  - to allow community members to create their own interfaces for their
    smart-contracts

- @kadena/client-utils/
  - faucet
  - marmalade
  - principles
  - namespace
