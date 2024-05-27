---
title: Cryptographic utilities
description:
  The `@kadena/cryptography-utils` library provides a collection of utility functions to perform common cryptographic operations, including generating a hash for transactions.
menu: Frontend libraries
label: Cryptographic utilities
order: 3
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Cryptography utilities

The `@kadena/cryptography-utils` library provides a collection of cryptographic utility functions. 
This library is used by the Kadena client—kadena.js—to hash your transactions. 
If you have secret keys available, you can also sign transactions using functions in this library.

The library includes the following utility functions for performing cryptographic operations:

| Use this function | To do this
| ----------------- | ------------
| binToHex | Convert binary numbers to hexadecimal strings.
| hexToBin | Convert hexadecimal strings to binary numbers.
| base64UrlEncode | Encode text as a Base64-encoded URL.
| base64UrlDecode | Convert a Base64-encoded URL to text.
| base64UrlEncodeArr | Encode an array of text as Base64 values that can be used for URLs.
| base64UrlDecodeArr | Decode Base64 arrays into text.
| strToUint8Array | Convert a string to a Uint8Array.
| uint8ArrayToStr | Convert a Uint8Array to a string.
| hash | Generate a cryptographic hash for a transaction.
| hashBin | Convert a string to a hashed binary using the BLAKE2b-256 hashing algorithm.
| genKeyPair | Generate a random, cryptographically secure public and secret key using the ED25519 signature scheme.
| restoreKeyPairFromSecretKey | Restore a key pair from a secret phrase.
| sign | Generate a hash using the BLAKE2b-256 hashing algorithm and sign a transaction with a public and secret key pair.
| signHash | Sign a hashed message using a public and secret key pair.
| verifySig | Verify a signature.
| unique |  Convert an array with IBase64Url values into an array with unique IBase64Url values.
| toTweetNaclSecretKey | Convert a public and secret key pair into Uint8Array binary object.

You can find the generated API documentation for these utilities in
[crypto.api.md](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/cryptography-utils/etc/crypto.api.md) and [cryptography-utils.api.md](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/cryptography-utils/etc/cryptography-utils.api.md).

## Examples

```ts
import { hash, sign } from '@kadena/cryptography-utils';
import { IKeyPair } from '@kadena/types';

// Create a command
let commandPayload: string = 'Hello world!';

// Get the has of the command
let h: string = hash(commandPayload);

// Signing is normally handled by wallets, but if you have the private key
// available to you, you can also sign in this way:
let keyPair: IKeyPair = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};

let sig: string = sign(commandPayload, keyPair);
```