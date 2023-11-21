# ADR: Use SLIP10 for Private Key Generation

**Date:** 2023-11-20

**Status:** Accepted

## Context

Kadena has already adopted the [BIP39][1] mnemonic standard and We need a
deterministic method for generating private keys from a mnemonic. this process
is commonly referred to as an HD wallet (Hierarchical Deterministic wallet).

HD wallets derive keys from a master key, typically following the [BIP32][2]
algorithm or the twisted version [SLIP10][3] (which offers a more general way
for other curve algorithms) or maybe a custom approach like Chainweaver. BIP32
enables the creation of either a chain of private keys or a chain of public
keys, each serving different purposes. For example, a blockchain using an
account model, like Kadena, primarily employs a chain of private keys, as it
doesn't require a new address for each transaction. Conversely, a blockchain
using the [UTXO][6] model, such as Bitcoin, can benefit from extended public
keys.

BIP32 accepts a derivation path that indicates the level of children keys and
also hardened or non-hardened keys. In the Bitcoin world (and other UTXO coins),
[BIP44][4] offers a 5-level path for the BIP32 algorithm. However, BIP44 is
widely adopted by account models blockchains as well, but since there is no need
for the `change` and `address` levels, they are skipped or considered as 0.

This record exclusively concentrates on private keys, as we currently have no
plans to use extended public keys in Kadena. Also, Kadena employs the ed25519
algorithm for keys, and the solution should be compatible with bip32-ed25519.

## Decision

We have chosen to implement the twisted BIP44 protocol for only 3 levels of
child keys, defining the path restriction as `m/44'/626'/${index}'`. This
decision is based on the following considerations:

- KDA (Kadena) coin-type is [626][5].
- KDA follows an account-model coin approach, and for each key, we modify the
  **account** (the third level in BIP44).
- We only use this for **private key** generation.
- Extended public keys are beyond the scope of this decision.
- All private keys are **hardened** in accordance with the [ed25519][3]
  algorithm.

## Consequences

- We adopt a common approach for key derivation, promoting compatibility with
  other blockchains and wallets.
- Finding libraries for implementation will be more straightforward.
- We will need to manage legacy algorithms, such as Chainweaver, for backward
  compatibility.
- Some wallets already use `m/44'/626'/0'/0'/${index}'` instead of the adopted
  path. Therefore, we should allow users to specify a custom path as well.

## Resources

- [BIP39 Proposal][1]
- [BIP32 Proposal][2]
- [SLIP-0010: Universal Private Key Derivation from Master Private Key][3]
- [BIP44 Proposal][4]
- [SLIP-0044: Registered Coin Types for BIP-0044][5]
- [Unspent transaction output][6]

[1]: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
[2]: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
[6]: https://en.wikipedia.org/wiki/Unspent_transaction_output
[4]: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
[5]: https://github.com/satoshilabs/slips/blob/master/slip-0044.md
[3]: https://github.com/satoshilabs/slips/blob/master/slip-0010.md
