---
title: "02: Running Devnet"
description: "Election dApp tutorial chapter 02: Running Devnet"
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 02: Running Devnet

```
docker run -it -p 8080:8080 -v ./:/tmp/uploads kadena/devnet:latest
```

### Listing modules

You will see preloaded contracts among which the contracts in the `./pact/root`
folder. No voting related contracts yet.

### Configure Devnet in Chainweaver

Settings > Network.
Node: http://localhost:8080

### List modules

Same result as when running the snippet
