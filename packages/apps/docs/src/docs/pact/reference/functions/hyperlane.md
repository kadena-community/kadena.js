---
title: Hyperlane
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Hyperlane
label: Hyperlane
order: 11
layout: full
tags: ['pact', 'language reference', 'hyperlane', 'spi']
---

# Hyperlane

## hyperlane-message-id

_msg_&nbsp;`object:{hyperlane-token-msg}` _&rarr;_&nbsp;`string`

Get the Message Id of a Hyperlane Message object.

```pact
pact> (hyperlane-message-id {"destinationDomain": 1,"nonce": 325,"originDomain": 626,"recipient": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F","sender": "0x6b622d746f6b656e2d726f75746572","tokenMessage": {"amount": 10000000000000000000.0,"recipient": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"},"version": 1})
"0x97d98aa7fdb548f43c9be37aaea33fca79680247eb8396148f1df10e6e0adfb7"
```

## hyperlane-decode-token-message

_x_&nbsp;`string` _&rarr;_&nbsp; object:{hyperlane-token-msg}`

Decode a base-64-unpadded encoded Hyperlane Token Message into an object
`{recipient:GUARD, amount:DECIMAL, chainId:STRING}`.

```pact
pact> (hyperlane-decode-token-message "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAewAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGF7InByZWQiOiAia2V5cy1hbGwiLCAia2V5cyI6WyJkYTFhMzM5YmQ4MmQyYzJlOTE4MDYyNmEwMGRjMDQzMjc1ZGViM2FiYWJiMjdiNTczOGFiZjZiOWRjZWU4ZGI2Il19AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
{"amount": 0.000000000000000123
,"chainId": "4"
,"recipient": KeySet {keys: [ da1a339bd82d2c2e9180626a00dc043275deb3ababb27b5738abf6b9dcee8db6 ] ,pred: keys-all}
}
```
