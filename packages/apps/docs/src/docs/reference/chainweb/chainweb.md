---
title: Chainweb client API
description:
  The Chainweb client API provides a TypeScript based application programming interface API for interacting with Chainweb nodes on the Kadena network.
menu: Chainweb REST API
label: Chainweb client
order: 9
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# Chainweb client API

The Chainweb client API provides a TypeScript-based application programming interface (API) for interacting with Chainweb nodes on the Kadena network.

## Chainweb node client

Chainweb node client is a typed JavaScript wrapper with fetch to call
chainweb-node API endpoints. 
These endpoints are broken down into the following categories:

- blockchain - wrapper around chainweb-node peer-to-peer API endpoints
- pact - [https://api.chainweb.com/openapi/pact.html][2]
- rosetta - [https://api.chainweb.com/openapi/#tag/rosetta][3]

## Chainweb stream client for browsers and node.js

Stream account or module/event transactions from chainweb-stream, including
their confirmation depth.
