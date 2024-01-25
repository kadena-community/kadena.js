---
title: Commitments
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Commitments
label: Commitments
order: 8
layout: full
tags: ['pact', 'language reference', 'commitments']
---

# Commitments

## decrypt-cc20p1305

_ciphertext_&nbsp;`string` _nonce_&nbsp;`string` _aad_&nbsp;`string`
_mac_&nbsp;`string` _public-key_&nbsp;`string` _secret-key_&nbsp;`string`
_&rarr;_&nbsp;`string`

Perform decryption of CIPHERTEXT using the CHACHA20-POLY1305 Authenticated
Encryption with Associated Data (AEAD) construction described in IETF RFC 7539.
CIPHERTEXT is an unpadded base64url string. NONCE is a 12-byte base64 string.
AAD is base64 additional authentication data of any length. MAC is the
"detached" base64 tag value for validating POLY1305 authentication. PUBLIC-KEY
and SECRET-KEY are base-16 Curve25519 values to form the DH symmetric key.Result
is unpadded base64URL.

```pact
(decrypt-cc20p1305 ciphertext nonce aad mac pubkey privkey)
```

## validate-keypair

_public_&nbsp;`string` _secret_&nbsp;`string` _&rarr;_&nbsp;`bool`

Enforce that the Curve25519 keypair of (PUBLIC,SECRET) match. Key values are
base-16 strings of length 32.

```pact
(validate-keypair pubkey privkey)
```
