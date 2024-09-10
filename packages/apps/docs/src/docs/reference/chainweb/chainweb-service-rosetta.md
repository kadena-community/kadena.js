---
title: Rosetta endpoints
description:
  Provides reference information for the chainweb-node block endpoints.
menu: Chainweb API
label: Rosetta endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Rosetta endpoints

Chainweb node includes an implementation of the Rosetta API. 
The API is disabled by default and can be enabled in the configuration file of a node.

The following endpoints are supported, which are documented in [Rosetta](https://docs.cdp.coinbase.com/rosetta/docs/full-reference/) reference documentation.

- POST rosetta/account/balance
- POST rosetta/block/transaction
- POST rosetta/block
- POST rosetta/construction/metadata
- POST rosetta/construction/submit
- POST rosetta/mempool/transaction
- POST rosetta/mempool
- POST rosetta/network/list
- POST rosetta/network/options
- POST rosetta/network/status