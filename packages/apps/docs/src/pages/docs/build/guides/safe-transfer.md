---
title: Safe Transfer
description: Safe Transfer
menu: Build
label: Safe Transfer
order: 5
layout: full
---

# Safe Transfer

Many cryptocurrencies are plagued by the problem of users losing coins by making
a mistake with the public key they are transferring to and discovering that the
private key they thought would control the money doesn't work. Pact allows you
to construct coin transfers in a way that guarantees that someone is in
possession of the correct private key and it will work to access the coins. This
transaction does this by doing two transfers in a single transaction, one from
`alice` to `bob` for the desired amount plus a small amount extra coins for a
test transfer, and one from `bob` to `alice` transferring back the extra amount.

This is most important when you are doing `transfer-create` because that is when
you are defining the new account's keyset.

### Signing

This transaction must be signed by both the `alice` and `bob` accounts and each
signature must have the appropriate `coin.TRANSFER` capability. In this example,
the public key for the account `alice` is
`6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7` and the
public key for `bob` is
`368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca`.

### Transaction Template

```pact title=" "
code: |-
  (coin.transfer-create "alice" "bob" (read-keyset "ks") 200.1)
  (coin.transfer "bob" "alice" 0.1)
data:
  ks:
    keys: [368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: alice
  gasLimit: 1200
  gasPrice: 0.00001
  ttl: 7200
networkId: "mainnet01"
signers:
  - public: 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7
    caps:
      - name: "coin.TRANSFER"
        args: ["alice", "bob", 200.1]
      - name: "coin.GAS"
        args: []
  - public: 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca
    caps:
      - name: "coin.TRANSFER"
        args: ["bob", "alice", 0.1]
type: exec
```
