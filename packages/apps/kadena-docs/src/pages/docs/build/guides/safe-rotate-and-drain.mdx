---
title: Safe Rotate and Drain
description: Safe Rotate and Drain
menu: Build
label: Safe Rotate and Drain
order: 4
layout: full
---

This takes an account `rotest` owned by key
`2993f795d133fa5d0fd877a641cabc8b28cd36147f666988cacbaa4379d1ff93`, rotates it
to key `dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025`, and
transfers the whole balance to another account `croesus`. The `croesus` account
pays the gas which makes it easy to drain the `rotest` account balance to
exactly zero. The transfer out of `rotest` happens after the key is rotated
which means that this transaction MUST be signed by the key you are rotating to
and is therefore "safe"...i.e. it is impossible to accidentally rotate to an
incorrect key and lose control of the `rotest` account.

### Signing

This transaction must be signed by both the key that owns `rotest` at the
beginning and the key that owns `rotest` at the end.

#### Transaction Template

```pact title=" "
code: |-
  (use coin)
  (let* ((acct:string "rotest")
         (bal:decimal (coin.get-balance acct))
        )
    (coin.rotate acct (read-keyset "ks"))
    (coin.transfer acct
      "croesus"
      bal)
  )
data:
  ks:
    keys: [dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: croesus
  gasLimit: 800
  gasPrice: 0.00001
  ttl: 86400
networkId: "testnet04"
signers:
  - public: 2993f795d133fa5d0fd877a641cabc8b28cd36147f666988cacbaa4379d1ff93
    caps:
      - name: coin.GAS
        args: []
      - name: coin.ROTATE
        args: ["rotest"]
  - public: dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025
    caps:
      - name: coin.TRANSFER
        args: ["rotest","croesus",100]
type: exec
```
