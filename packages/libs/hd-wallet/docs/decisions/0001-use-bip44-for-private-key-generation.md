# ADR: Use BIP44 for Private Key Generation

**Date:** 2023-10-31

**Status:** Accepted

## Context

We require a deterministic method for generating private keys from a mnemonic,
as Kadena has already adopted the [BIP39][1] mnemonic standard. In the realm of
cryptocurrencies, this process is commonly referred to as creating an HD-wallet
(Hierarchical Deterministic wallet).

HD wallets derive keys from a master key, typically following the [BIP32][2]
algorithm, which permits various derivation paths for both hardened and
non-hardened keys to create a chain of keys. BIP32 enables the creation of
either a chain of private keys or a chain of public keys, each serving different
purposes. For example, a blockchain using an account model, like Kadena,
primarily employs a chain of private keys, as it doesn't require a new address
for each transaction. Conversely, a blockchain using the [UTXO][3] model, such
as Bitcoin, can benefit from extended public keys.

This record exclusively concentrates on private keys, as we currently have no
plans to use extended public keys in Kadena. Kadena employs the ed25519
algorithm for keys, and the solution should be compatible with bip32-ed25519.

## Decision

We have chosen to implement the [BIP44][4] protocol, defining the path
restriction for BIP32 as `m/44'/626'/${index}'/0'/0'`. This decision is based on
the following considerations:

- KDA (Kadena) utilizes the coin-type [626][5].
- KDA follows an account-model coin approach, and for each key, we modify the
  **'account** (third component in BIP44).
- We exclusively use BIP44 for **private key** generation.
- Extended public keys are beyond the scope of this decision.
- All private keys are **hardened** in accordance with the [ed25519][6]
  algorithm.

## Consequences

- We adopt a standard approach for key derivation, promoting compatibility with
  other blockchains and wallets.
- Finding libraries for implementation will be more straightforward.

- We will need to manage legacy algorithms, such as Chainweaver, for backward
  compatibility.

- Some wallets already use `m/44'/626'/0'/0'/${index}'` instead of the adopted
  path. Therefore, we should allow users to specify a custom path starting with
  `m/44'/626'` as well.

## Resources

- [BIP39 Proposal][1]
- [BIP32 Proposal][2]
- [Unspent transaction output][3]
- [BIP44 Proposal][4]
- [SLIP-0044: Registered Coin Types for BIP-0044][5]
- [SLIP-0010: Universal Private Key Derivation from Master Private Key][6]

[1]: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
[2]: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
[3]: https://en.wikipedia.org/wiki/Unspent_transaction_output
[4]: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
[5]: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
[6]: https://github.com/satoshilabs/slips/blob/master/slip-0010.md
