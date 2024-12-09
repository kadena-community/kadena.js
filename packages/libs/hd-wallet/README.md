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

## Key Concepts

- **Mnemonic Phrase**: A human-readable set of words derived from entropy,
  designed to make cryptographic keys easier to back up and restore. It serves
  as a representation of the underlying entropy.
- **Seed**: A binary value derived from the mnemonic phrase (using a hashing
  algorithm, optionally with a passphrase). The seed is used to derive the
  master private key. It cannot be converted back to the mnemonic or entropy.
- **Derivation Path**: A structured way to derive multiple key pairs from a
  single master seed.
- **[SLIP-0010](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/hd-wallet/docs/decisions/0001-use-slip10-for-private-key-generation.md)**:
  The standard used for key derivation, ensuring compatibility with other
  systems.
- **[KIP-0026 (draft)](https://github.com/Takadenoshi/KIPs/blob/kip-0026/kip-0026.md)**
  Key Derivation and Mnemonic encoding methods for Kadena

## High-Level Steps

1. **Generate a Mnemonic Phrase**
2. **Convert Mnemonic to Seed**
3. **Generate Key Pairs from Seed**
4. **Sign Transactions with Keys**

## Key Generation and Management

### 1. Generating a Mnemonic Phrase

A mnemonic phrase is the starting point for creating your wallet. It is a
sequence of words that encodes the seed for generating keys. You can generate a
12-word mnemonic phrase using the following function:

```javascript
import { kadenaGenMnemonic } from '@kadena/hd-wallet';

const mnemonic = kadenaGenMnemonic();
console.log(mnemonic); // Outputs a 12-word mnemonic phrase
```

### 2. Convert Entropy to Mnemonic

You can also generate a mnemonic phrase from a specific entropy value using the
following function:

> **IMPORTANT**  
> This isn't necessarily the same mnemonic from which the entropy was generated

```javascript
import { kadenaEntropyToMnemonic } from '@kadena/hd-wallet';

const entropy = Uint8Array.from([
  163, 41, 221, 226, 205, 60, 81, 126, 184, 28, 50, 202, 148, 255, 178, 6,
]);
const mnemonic = kadenaEntropyToMnemonic(entropy);
console.log(mnemonic); // Outputs: "permit exclude judge omit shallow satisfy there main skin pony uncle arrive"
```

### 3. Mnemonic to Seed Conversion

Once a mnemonic is generated, you can convert it into a seed. The seed can then
be used to derive keys. This example shows how to encrypt the seed with a
password.

```javascript
import { kadenaMnemonicToSeed } from '@kadena/hd-wallet';

const mnemonic =
  'permit exclude judge omit shallow satisfy there main skin pony uncle arrive';
const password = 'secret';

const seed = await kadenaMnemonicToSeed(password, mnemonic);
console.log(seed); // Outputs the encrypted seed, this can be different every time due to included salt
// Output: "VmVDaFBDT2RtTVU2YXJPbll3dW8zUT09LjdHZUhqQkg5ZUlBdjRhWXouRjN2cTBOdHpGeW1aSEdkaW01ZDZQZ3kvZzl0ZytyUS9FZkdtMElvTWY1aHRDcVV1UCthTXIyWGtJZXVYSjZDUVRsQXdZREdTUTZZekRVTDVnK0lnaWRIYmhPRDB0TlNhWkxldHFnL3lOdVU9"
```

### 4. Key Pair Generation from Seed

The `kadenaGenKeypairFromSeed` function generates a public-private key pair from
a seed. You can specify an index or range of indices to generate multiple key
pairs.

```javascript
import { kadenaGenKeypairFromSeed } from '@kadena/hd-wallet';

const password = 'your_password';
const [publicKey, privateKey] = await kadenaGenKeypairFromSeed(
  password,
  seed,
  0,
);

console.log(publicKey, privateKey); // Outputs the generated key pair
```

You can also generate a range of key pairs:

```javascript
const keyPairs = await kadenaGenKeypairFromSeed(password, seed, [0, 3]);
console.log(keyPairs); // Outputs an array of key pairs
```

### 5. Generate Random Key Pairs

In some cases, you may want to generate key pairs randomly without deriving them
from a seed. Use the `kadenaKeyPairsFromRandom` function to generate a specified
number of random key pairs:

```javascript
import { kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';

const keyPairs = kadenaKeyPairsFromRandom(2); // Generates two random key pairs
console.log(keyPairs); // Outputs an array of random key pairs
```

### 6. Public Key Retrieval

You can retrieve the public key directly from the encrypted seed without the
need to access the private key. This is useful for read-only operations.

```javascript
import { kadenaGetPublic } from '@kadena/hd-wallet';

const publicKey = await kadenaGetPublic(password, seed, 0);
console.log(publicKey); // Outputs the public key for the specified index
```

### 7. Signing Transactions

To sign a transaction, you can either use a key pair or the encrypted seed with
an index. The following example demonstrates signing a transaction with a key
pair.

```javascript
import { kadenaSignWithKeyPair } from '@kadena/hd-wallet';

const signFn = kadenaSignWithKeyPair(password, publicKey, privateKey);
const signature = await signFn(txHash);
console.log(signature); // Outputs the transaction signature
```

Alternatively, you can sign using a seed and index:

```javascript
import { kadenaSignWithSeed } from '@kadena/hd-wallet';

const signature = await kadenaSignWithSeed(password, seed, 0)(txHash);
console.log(signature); // Outputs the transaction signature
```

### 8. Verifying Signatures

After signing a transaction, you may need to verify its signature. The
`kadenaVerify` function allows you to verify that a given signature matches the
public key and message.

```javascript
import { kadenaVerify } from '@kadena/hd-wallet';

const isValid = kadenaVerify(txHash, publicKey, signature.sig);
console.log(isValid); // Outputs true if the signature is valid
```

## Legacy Chainweaver (version 2) Support

For backward compatibility with the legacy Chainweaver wallet, use the following
functions. These functions allow integration with older systems while
maintaining compatibility with the new Kadena SDK.

### Mnemonic Generation (Legacy)

The `kadenaGenMnemonic` function from the legacy Chainweaver wallet generates a
mnemonic phrase, which is similar to modern HD wallets but follows older
practices.

```javascript
import { kadenaGenMnemonic } from '@kadena/hd-wallet/chainweaver';

const mnemonic = kadenaGenMnemonic();
console.log(mnemonic); // Outputs a 12-word mnemonic phrase
```

### Mnemonic Validation (Legacy)

To validate a mnemonic, use the `kadenaCheckMnemonic` function to ensure the
mnemonic is correct before proceeding with key generation.

```javascript
import { kadenaCheckMnemonic } from '@kadena/hd-wallet/chainweaver';

const isValid = kadenaCheckMnemonic(mnemonic);
console.log(isValid); // Outputs true if the mnemonic is valid
```

### Key Pair Generation (Legacy)

The legacy function `kadenaGenKeypair` allows generating a key pair using a seed
phrase. This method follows the older Chainweaver key derivation process.

```javascript
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';

const [publicKey, privateKey] = await kadenaGenKeypair(seed, password, 0);
console.log(publicKey, privateKey); // Outputs the key pair generated using Chainweaver's method
```

### Password Change for Seed (Legacy)

If you need to change the password used to encrypt a seed in the legacy system,
the `kadenaChangePassword` function handles the re-encryption.

```javascript
import { kadenaChangePassword } from '@kadena/hd-wallet/chainweaver';

const newSeed = await kadenaChangePassword(oldPassword, newPassword, seed);
console.log(newSeed); // Outputs the seed encrypted with the new password
```

### Signing with a Key Pair (Legacy)

To sign a transaction with a key pair in the legacy Chainweaver wallet, use the
`kadenaSign` function.

```javascript
import { kadenaSign } from '@kadena/hd-wallet/chainweaver';

const signature = await kadenaSign(publicKey, privateKey, txHash);
console.log(signature); // Outputs the transaction signature using the legacy key pair
```

### Public Key Retrieval from Root Key (Legacy)

To retrieve the public key from the root key, use the
`kadenaGetPublicFromRootKey` function. This function derives the public key from
the legacy Chainweaver’s root key.

```javascript
import { kadenaGetPublicFromRootKey } from '@kadena/hd-wallet/chainweaver';

const publicKey = await kadenaGetPublicFromRootKey(password, seed, index);
console.log(publicKey); // Outputs the public key for the specified index using the root key
```

### Key Pair Generation from Root Key (Legacy)

If you need to generate a key pair from the root key in the legacy system, use
the `kadenaMnemonicToRootKeypair` function.

```javascript
import { kadenaMnemonicToRootKeypair } from '@kadena/hd-wallet/chainweaver';

const [publicKey, privateKey] = await kadenaMnemonicToRootKeypair(
  mnemonic,
  password,
  index,
);
console.log(publicKey, privateKey); // Outputs the key pair derived from the root key in the legacy system
```

### Signing from Root Key (Legacy)

To sign a transaction using a root key, the `kadenaSignFromRootKey` function can
be used to derive the signature from the root key.

```javascript
import { kadenaSignFromRootKey } from '@kadena/hd-wallet/chainweaver';

const signature = await kadenaSignFromRootKey(password, seed, index, txHash);
console.log(signature); // Outputs the transaction signature using the root key
```

### Decrypting Seed or Private Key

Decrypt the encrypted seed or private key using `kadenaDecrypt`:

```javascript
import { kadenaDecrypt } from '@kadena/hd-wallet';

const decryptedSeed = kadenaDecrypt(password, seed);
console.log(decryptedSeed); // Outputs the decrypted seed
```

## Integration Guide for Developers

### How to Use in Your Wallet Application

If you’re building a wallet application, you can integrate these key generation
and signing functionalities directly. Here’s a simple flow for implementation:

1. **Generate a mnemonic phrase** and store it securely (e.g., show the user
   their backup phrase).
2. **Convert the mnemonic to a seed** and encrypt it with a password before
   storing.
3. **Generate key pairs as needed** using indices (e.g., index 0 for the primary
   account, index 1 for a secondary account).
4. **Sign transactions** with the private key or directly with the seed.
5. **Retrieve public keys** when you need to display addresses or verify
   signatures.

### Key Derivation Path

The Kadena wallet uses the standard derivation path
([SLIP-0010](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/hd-wallet/docs/decisions/0001-use-slip10-for-private-key-generation.md)):

```
m'/44'/626'/<index>'
```

<!-- genericHeader end -->

### Architectural decisions

Check [ADRs][1] documents for more information

# Getting started

## Installation

To install the library, you can use npm or yarn:

```sh
npm install @kadena/wallet-sdk
```

or

```sh
yarn add @kadena/wallet-sdk
```

[1]: ./docs/decisions/

## Conclusion

The `@kadena/hd-wallet` library offers a robust set of tools for generating
mnemonics, deriving seeds, and managing Kadena keys. This README covers the
basic usage scenarios. For more detailed documentation, please refer to the
library's source code and additional resources.

If you encounter any issues or have any questions, feel free to open an issue on
the project's [GitHub repository][2].

[1]: ./docs/decisions/
[2]: https://github.com/kadena-community/kadena.js/issues/new/choose
