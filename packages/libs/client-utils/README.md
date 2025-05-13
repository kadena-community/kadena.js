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

Find a [minimal interactive example at CodeSandbox][1]

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

## Gas Price Estimation

This module also provides tools for estimating optimal gas prices and analyzing
gas usage from recent blocks on the Kadena blockchain.

```ts
import {
  estimateGasPrice,
  getBlocksGasInformation,
} from '@kadena/client-utils';
```

### `estimateGasPrice`

Estimates a suitable gas price by analyzing recent block data. The estimated
value is the median of the minimum gas prices from a set of 20 recent blocks,
after filtering out any empty blocks.

#### **Signature**

```ts
estimateGasPrice(parameters: IGasPriceEstimateProperties): Promise<number>
```

#### **Parameters**

- `host?` _(string)_: Optional base URL of the Chainweb API (defaults to
  Kadena's mainnet/testnet based on `networkId`).
- `chainId` _(string)_: Chain ID (e.g., `"0"` through `"19"`).
- `networkId?` _(string)_: Network ID (e.g., `"mainnet01"`, `"testnet04"` -
  default `"mainnet01"` ).
- `height?` _(number)_: Optional block max height ( default the chian height).
- `items?` _(number)_: Number of blocks to fetch (default: `20`).

#### **Returns**

- `Promise<number>`: Estimated gas price (defaults to `1e-7` if no transactions
  are found).

#### **Example**

```ts
const price = await estimateGasPrice({
  chainId: '0',
  networkId: 'mainnet01',
});
console.log(`Suggested gas price: ${price}`);
```

---

### `getBlocksGasInformation`

Fetches recent block data and returns gas usage statistics for each block. This
information can be used to estimate gas prices based on custom criteria.

#### **Signature**

```ts
getBlocksGasInformation(parameters: IGasPriceEstimateProperties): Promise<IBlockGasInformation[]>
```

#### **Parameters**

- `host?` _(string)_: Optional base URL of the Chainweb API (defaults to
  Kadena's mainnet/testnet based on `networkId`).
- `chainId` _(string)_: Chain ID (e.g., `"0"` through `"19"`).
- `networkId?` _(string)_: Network ID (e.g., `"mainnet01"`, `"testnet04"` -
  default `"mainnet01"` ).
- `height?` _(number)_: Optional block max height ( default the chian height).
- `items?` _(number)_: Number of blocks to fetch (default: `20`).

#### **Returns**

- `Promise<IBlockGasInformation[]>`: Array of gas information objects per block.

#### **Example**

```ts
const blocks = await getBlocksGasInformation({
  chainId: '0',
  networkId: 'mainnet01',
});
console.log(blocks);
```

### `IBlockGasInformation` Structure

Each block's gas info includes:

- `blockHeight`: Block number
- `totalGasConsumed`: Sum of actual gas used by all txs
- `totalGasLimit`: Sum of declared gas limits
- `totalGasPaid`: Total `gasPrice * gasLimit` of all txs
- `txCount`: Number of transactions
- `blockGasUsedPercent`: Gas usage vs block capacity
- `gasPriceStats`:
  - `min`: Minimum gas price
  - `max`: Maximum gas price
  - `avg`: Average gas price
  - `median`: Median gas price

### Notes

- Uses `https://api.chainweb.com` for mainnet and
  `https://api.testnet.chainweb.com` for testnet by default.
- Block gas capacity is assumed as `150000`.
- Skips blocks with zero transactions when estimating gas price.

[1]:
  https://githubbox.com/kadena-community/kadena.js/tree/main/packages/libs/client-utils/codesandbox
