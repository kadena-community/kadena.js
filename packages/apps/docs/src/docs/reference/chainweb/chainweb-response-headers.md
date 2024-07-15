---
title: Common response headers
description:
  Provides reference information for the chainweb-node block endpoints.
menu: Chainweb API
label: Common response headers
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Common response headers

Response Headers
## Server Timestamp
x-server-timestamp: The time of the clock of the remote node

integer (POSIX Timestamp) >= 0
Seconds since POSIX epoch


Copy
1619108524

## Chainweb Node Version
x-chainweb-node-version: The version of the remote chainweb node

any (Chainweb Version)
Enum: "test-singleton" "development" "mainnet01" "testnet04"
The version of the Chainweb network


Copy
"test-singleton"

 ## Client Peer Address
x-peer-addr: Host and port of the client as observed by the remote node

string (Host Address) ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$
Host address containing IPv4 and port


Copy
"10.36.1.3:42988"