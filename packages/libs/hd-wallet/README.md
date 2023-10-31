<!-- genericHeader start -->

# @kadena/hd-wallet

The library for managing seed generation and key derivation for hd wallets.
Chainweaver protocol: supports legacy chainweaver bip39/bip32 with a custom
derivation path

## BIP39

Seed generation based on bip39 and 12 words

## Chainweaver protocol:

it uses the bundle file from
[kadena-crypto](https://github.com/kadena-io/cardano-crypto.js/tree/jam%40chainweaver-keygen)
repo

## BIP44:

derivation path: `m/44'/626'/${index}'/0'/0'`; all keys hardened

## Public Key

public key generation algorithm: `ed25519`

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

### Architectural decisions

Check [ADRs](./docs/decisions/) documents for more information
