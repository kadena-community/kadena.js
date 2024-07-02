<!-- genericHeader start -->

# @kadena/hd-wallet

Key derivation based on Hierarchical Deterministic (HD)/Mnemonic keys and BIP32,
for Kadena

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

### Architectural decisions

Check [ADRs][1] documents for more information

# Getting started

The `@kadena/hd-wallet` library provides tools to generate mnemonics, derive
seeds, and generate and sign transactions with Kadena keys. This README will
guide you through installing, using, and understanding the core functionalities
of the library.

## Installation

To install the library, you can use npm or yarn:

```sh
npm install @kadena/hd-wallet
```

or

```sh
yarn add @kadena/hd-wallet
```

## Structure

The library is divided into two parts:

1. `@kadena/hd-wallet` - The main library that provides functions to generate
   mnemonics, derive seeds, and sign transactions.
2. `@kadena/hd-wallet/chainweaver` - The Chainweaver-specific library that
   provides the **same functions**, but based on the Chainweaver-generated
   derivation algorithm.

## Usage

Below are some common use cases for the `@kadena/hd-wallet` library.

### Generating a Mnemonic

A mnemonic is a set of words that can be used to generate a seed. You can
generate a mnemonic using `kadenaGenMnemonic`:

```javascript
import { kadenaGenMnemonic } from '@kadena/hd-wallet';

const mnemonic = kadenaGenMnemonic();
console.log(mnemonic); // Outputs a 12-word mnemonic
```

### Converting Mnemonic to Seed

Once you have a mnemonic, you can convert it to a seed using
`kadenaMnemonicToSeed`. This seed can be encrypted with a password for added
security:

```javascript
import { kadenaGenMnemonic, kadenaMnemonicToSeed } from '@kadena/hd-wallet';

const password = 'password';
const mnemonic = kadenaGenMnemonic();
const seed = await kadenaMnemonicToSeed(password, mnemonic);
console.log(seed); // Outputs an encrypted seed string
```

### Signing a Transaction with Seed

You can sign a transaction using a seed and an index. First, create a signer
using `kadenaSignWithSeed`:

```javascript
import {
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
} from '@kadena/hd-wallet';

const password = 'password';
const mnemonic = kadenaGenMnemonic();
const seed = await kadenaMnemonicToSeed(password, mnemonic);
const index = 0;
const hash = 'transaction-hash';

const signer = kadenaSignWithSeed(password, seed, index);
const signature = await signer(hash);
console.log(signature); // Outputs the signature
```

### Generating a Key Pair from Seed

Generate a key pair (public and private keys) from a seed using
`kadenaGenKeypairFromSeed`:

```javascript
import {
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
} from '@kadena/hd-wallet';

const password = 'password';
const mnemonic = kadenaGenMnemonic();
const seed = await kadenaMnemonicToSeed(password, mnemonic);

const [publicKey, privateKey] = await kadenaGenKeypairFromSeed(
  password,
  seed,
  0,
);
// Outputs the public key and encrypted private key
console.log(publicKey, privateKey);
```

### Signing a Transaction with Key Pair

Sign a transaction using a key pair (public and private keys) with
`kadenaSignWithKeyPair`:

```javascript
import {
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
  kadenaSignWithKeyPair,
} from '@kadena/hd-wallet';

const password = 'password';
const mnemonic = kadenaGenMnemonic();
const seed = await kadenaMnemonicToSeed(password, mnemonic);
const [publicKey, privateKey] = await kadenaGenKeypairFromSeed(
  password,
  seed,
  0,
);

const txHash = 'tx-hash';
const signer = kadenaSignWithKeyPair(password, publicKey, privateKey);
const signature = await signer(txHash);
console.log(signature); // Outputs the signature
```

### Retrieving Public Keys from Seed

Retrieve public keys from a seed using `kadenaGetPublic`:

```javascript
import {
  kadenaGenMnemonic,
  kadenaGetPublic,
  kadenaMnemonicToSeed,
} from '@kadena/hd-wallet';

const password = 'password';
const mnemonic = kadenaGenMnemonic();
const seed = await kadenaMnemonicToSeed(password, mnemonic);

const publicKeyIndex0 = await kadenaGetPublic(password, seed, 0);
const publicKeyIndex1 = await kadenaGetPublic(password, seed, 1);

console.log(publicKeyIndex0, publicKeyIndex1); // Outputs public keys for index 0 and 1
```

### Decrypting Seed or Private Key

Decrypt the encrypted seed or private key using `kadenaDecrypt`:

```javascript
import { kadenaDecrypt } from '@kadena/hd-wallet';

const decryptedSeed = kadenaDecrypt(password, seed);
console.log(decryptedSeed); // Outputs the decrypted seed
```

## Conclusion

The `@kadena/hd-wallet` library offers a robust set of tools for generating
mnemonics, deriving seeds, and managing Kadena keys. This README covers the
basic usage scenarios. For more detailed documentation, please refer to the
library's source code and additional resources.

If you encounter any issues or have any questions, feel free to open an issue on
the project's [GitHub repository][2].

[1]: ./docs/decisions/
[2]: https://github.com/kadena-community/kadena.js/issues/new/choose
