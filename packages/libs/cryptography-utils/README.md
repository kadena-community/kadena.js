# kadena.js - Cryptography-Utils

<p align="center">
  <picture>
    <source srcset="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
    <img src="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
  </picture>
</p>

> Cryptography-Utils is a collection of cryptography utility functions.
> This library is used by kadena.js to hash your transactions.
> If you have private keys available, you can also sign them with this library.

API Reference can be found here [cryptography-utils.api.md](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/cryptography-utils/etc/cryptography-utils.api.md)
<hr>

# Usage Examples
```ts
import { IKeyPair } from '@kadena/types';
import { hash, sign } from '@kadena/cryptography-utils';

// Create a command
let commandPayload: string = 'Hello world!';

// Get the has of the command
let h: string = hash(commandPayload);

// Signing is normally handled by wallets, but if you have the private key
// available to you, you can also sign in this way:
let keyPair: KeyPair = {
  publicKey:
    'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey:
    '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};

let sig: string = sign(commandPayload, keyPair);

```


# Available Functions
crypto:

- `binToHex`
- `hexToBin`
- `base64UrlEncode`
- `base64UrlDecode`
- `base64UrlEncodeArr`
- `base64UrlDecodeArr`
- `strToUint8Array`
- `uint8ArrayToStr`
- `hash`
- `hashBin`
- `genKeyPair`
- `restoreKeyPairFromSecretKey`
- `sign`
- `signHash`
- `verifySig`
- `unique`
- `toTweetNaclSecretKey`
