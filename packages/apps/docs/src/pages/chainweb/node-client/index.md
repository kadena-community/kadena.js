---
title: Chainweb Node Client
description: Kadena makes blockchain work for everyone.
menu: Node Client
label: Chainweb Node Client
order: 1
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/chainweb-node-client/README.md
layout: full
tags: [chainweb,pact,reference]
lastModifiedDate: Mon, 10 Jul 2023 09:00:36 GMT
---
# Chainweb Node Client

Chainweb Node Client is a typed JavaScript wrapper with fetch to call
chainweb-node API endpoints. These endpoints are broken down into three
categories:

1.  blockchain - wrapper around chainweb-node p2p api endpoints
2.  pact - [https://api.chainweb.com/openapi/pact.html ](https://api.chainweb.com/openapi/pact.html)
3.  rosetta - [https://api.chainweb.com/openapi/#tag/rosetta ](https://api.chainweb.com/openapi/#tag/rosetta)

The Pact API will contain the following functions:

*   `listen`
*   `local`
*   `mkCap`
*   `parseResponse`
*   `parseResponseTEXT`
*   `poll`
*   `send`
*   `spv`
*   `stringifyAndMakePOSTRequest`
