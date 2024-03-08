---
title: SPV
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: SPV
label: SPV
order: 7
layout: full
tags: ['pact', 'language reference', 'spv', 'spv proof verification']
---

# SPV

## verify-spv

_type_&nbsp;`string` _payload_&nbsp;`object:<in>` _&rarr;_&nbsp;`object:<out>`

Performs a platform-specific spv proof of type TYPE on PAYLOAD. The format of
the PAYLOAD object depends on TYPE, as does the format of the return object.
Platforms such as Chainweb will document the specific payload types and return
values.

```pact
(verify-spv "TXOUT" (read-msg "proof"))
```
