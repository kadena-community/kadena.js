---
title: 'Workshop: NFT marketplace'
description: Learn how to create, mint, sell, and buy tokens using Marmalade marketplace smart contracts on the Kadena blockchain.
menu: 'Workshop: NFT marketplace'
label: 'Bid and buy'
order: 7
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Bid and buy

The NFT marketplace workshop is in early stages of development. To contribute to this tutorial series, open a pull request in the [kadena.js](https://github.com/kadena-community/kadena.js) repository and add the **documentation** label to the pull request.

## Connect to Kadena SpireKey

You can connect to Kadena SpireKey and request account information from an application by send a `GET` request to the Kadena SpireKey `/connect` endpoint and specifying a return URL with appropriate parameters to return the user to your application.

The following example illustrates an application running locally on `http://localhost:3000` that's deployed on the `testnet04` network:

https://spirekey.kadena.io/connect?returnUrl=http:/localhost:3000&networkId=testnet04&networkId=testnet04
