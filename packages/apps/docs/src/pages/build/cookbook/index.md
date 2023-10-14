---
title: Pact-lang-API Cookbook
description: Common use cases for `pact-lang-api`
menu: Cookbook
label: Cookbook
order: 3
layout: full
tags: [pact, typescript, account, transactions, utils]
---

# Pact-lang-API Cookbook

## Overview

| Name                                                                          | Description                                  |
| ----------------------------------------------------------------------------- | -------------------------------------------- |
| **ACCOUNTS**                                                                  |                                              |
| [Create Account](/build/cookbook#create-accounth278621961)                    | Create a KDA account.                        |
| [Create And Fund Account](/build/cookbook#create-and-fund-accounth-216351201) | Create and fund a KDA account.               |
| [Rotate Keys](/build/cookbook#rotate-keysh-822051431)                         | Update the keyset controlling the account.   |
| [Get Balance](/build/cookbook#get-balanceh646980562)                          | Get the KDA account balance.                 |
| **TRANSACTIONS**                                                              |                                              |
| [Get Transaction Status](/build/cookbook#get-transaction-statush155365598)    | Get transaction status using Tx request key. |
| **UTILS**                                                                     |                                              |
| [Deploy contract](#deploy-contracth59420715)                                  | Deploy a Pact smart contract.                |
| [Read State](/build/cookbook#read-stateh2758023)                              | Read state of a contract.                    |
| [Verify Signature](/build/cookbook#verify-signatureh1418798545)               | Verify a key pair signature.                 |

:::tip For convenience you can find all these scripts in a
[repository](https://github.com/raduciobanu22/pact-lang-api-cookbook). :::

## Accounts

### Create Account

```typescript title="Create a KDA account"
const HELP = `Usage example: \n\nnode create-account.js k:{public-key} -- Replace {public-key} with an actual key`;

const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const KEY_PAIR = {
  publicKey: '',
  secretKey: '',
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 3) {
  console.log(process.argv);
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === '' || KEY_PAIR.secretKey === '') {
  console.error('Please set a key pair');
  process.exit(1);
}

createAccount(process.argv[2]);

async function createAccount(newAccount) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: KEY_PAIR,
    pactCode: `(coin.create-account "${newAccount}" (read-keyset "account-keyset"))`,
    envData: {
      'account-keyset': {
        keys: [
          // Drop the k:
          newAccount.substr(2),
        ],
        pred: 'keys-all',
      },
    },
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: KEY_PAIR.publicKey,
    },
  };

  const response = await Pact.fetch.send(cmd, API_HOST);
  console.log(`Request key: ${response.requestKeys[0]}`);
  console.log('Transaction pending...');
  const txResult = await Pact.fetch.listen(
    { listen: response.requestKeys[0] },
    API_HOST,
  );
  console.log('Transaction mined!');
  console.log(txResult);
}
```

### Create And Fund Account

```typescript title="reate and fund a KDA account"
const HELP = `Usage example: \n\nnode transfer-create.js k:{public-key} amount -- Replace {public-key} with an actual key`;

const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const KEY_PAIR = {
  publicKey: '',
  secretKey: '',
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === '' || KEY_PAIR.secretKey === '') {
  console.error('Please set a key pair');
  process.exit(1);
}

transferCreate(KEY_PAIR.publicKey, process.argv[2], process.argv[3]);

async function transferCreate(sender, newAccount, amount) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: [
      Object.assign(KEY_PAIR, {
        clist: [
          Pact.lang.mkCap(
            'GAS',
            'Capability to allow buying gas',
            'coin.GAS',
            [],
          ).cap,
          Pact.lang.mkCap(
            'Transfer',
            'Capability to allow coin transfer',
            'coin.TRANSFER',
            [sender, newAccount, { decimal: amount }],
          ).cap,
        ],
      }),
    ],
    pactCode: `(coin.transfer-create  "${sender}" "${newAccount}" (read-keyset "account-keyset") ${amount})`,
    envData: {
      'account-keyset': {
        keys: [
          // Drop the k:
          newAccount.substr(2),
        ],
        pred: 'keys-all',
      },
    },
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: KEY_PAIR.publicKey,
    },
  };

  const response = await Pact.fetch.send(cmd, API_HOST);
  console.log(`Request key: ${response.requestKeys[0]}`);
  console.log('Transaction pending...');

  const txResult = await Pact.fetch.listen(
    { listen: response.requestKeys[0] },
    API_HOST,
  );
  console.log('Transaction mined!');
  console.log(txResult);
}
```

### Rotate Keys

```typescript title="Update the keyset controlling the account."
const HELP = 'Usage example: \n\nnode rotate {account} {new-guard}';
const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;

const KEY_PAIR = {
  publicKey: 'a5613bcbea7c5addcb55e8d59fab2b0ab9a792684977e2d3f682cce6f7d328e9',
  secretKey: 'f1031a628eb9a0467460130b406c5a6f95399d2d17585b341deb94e4182d36ff',
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 4) {
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === '' || KEY_PAIR.secretKey === '') {
  console.error('Please set a key pair');
  process.exit(1);
}

rotate(process.argv[2], process.argv[3]);

async function rotate(account, newKey) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: [
      Object.assign(KEY_PAIR, {
        clist: [
          Pact.lang.mkCap(
            'GAS',
            'Capability to allow buying gas',
            'coin.GAS',
            [],
          ).cap,
          Pact.lang.mkCap(
            'Rotate',
            'Capability to allow rotating account guard',
            'coin.ROTATE',
            [account],
          ).cap,
        ],
      }),
    ],
    pactCode: `(coin.rotate  "${account}" (read-keyset "new-keyset"))`,
    envData: {
      'new-keyset': {
        keys: [newKey],
        pred: 'keys-all',
      },
    },
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: account,
    },
  };
  console.log(cmd);

  const response = await Pact.fetch.send(cmd, API_HOST);
  console.log(response);
  console.log(`Request key: ${response.requestKeys[0]}`);
  console.log('Transaction pending...');
  const txResult = await Pact.fetch.listen(
    { listen: response.requestKeys[0] },
    API_HOST,
  );
  console.log('Transaction mined!');
  console.log(txResult);
}
```

### Get Balance

```typescript title="Get the KDA account balance"
const HELP = `Usage example: \n\nnode get-balance.js k:{public-key} -- Replace {public-key} with an actual key`;

const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const KEY_PAIR = {
  publicKey: '',
  secretKey: '',
};

const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 3) {
  console.log(process.argv);
  console.info(HELP);
  process.exit(1);
}

if (KEY_PAIR.publicKey === '' || KEY_PAIR.secretKey === '') {
  console.error('Please set a key pair');
  process.exit(1);
}

getBalance(process.argv[2]);

async function getBalance(account) {
  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: KEY_PAIR,
    pactCode: `(coin.get-balance "${account}")`,
    envData: {},
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 600,
      chainId: CHAIN_ID,
      gasPrice: 0.0000001,
      sender: KEY_PAIR.publicKey,
    },
  };

  const result = await Pact.fetch.local(cmd, API_HOST);
  console.log(result);
}
```

## Transactions

### Get Transaction Status

```typescript title="Get transaction status using Tx request key"
const HELP = 'Usage example: \n\nnode get-status {request-key}';
const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;

if (process.argv.length !== 3) {
  console.info(HELP);
  process.exit(1);
}

getTxStatus(process.argv[2]);

async function getTxStatus(requestKey) {
  const txResult = await Pact.fetch.listen({ listen: requestKey }, API_HOST);
  console.log(txResult);
}
```

## Utils

### Deploy Contract

```typescript title="Deploy a Pact smart contract"
const Pact = require('pact-lang-api');
const fs = require('fs');
const path = require('path');

const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const CONTRACT_PATH = path.join(__dirname, '/pact/hello-world.pact');

const KEY_PAIR = {
  publicKey: 'my-public-key',
  secretKey: 'my-private-key',
};

const creationTime = () => Math.round(new Date().getTime() / 1000) - 15;

deployContract();

async function deployContract() {
  const pactCode = fs.readFileSync(CONTRACT_PATH, 'utf8');

  const cmd = {
    networkId: NETWORK_ID,
    keyPairs: KEY_PAIR,
    pactCode: pactCode,
    envData: {},
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 65000,
      chainId: CHAIN_ID,
      gasPrice: 0.000001,
      sender: KEY_PAIR.publicKey,
    },
  };
  const response = await Pact.fetch.send(cmd, API_HOST);
  console.log(`Request key: ${response.requestKeys[0]}`);
  console.log('Transaction pending...');
  const txResult = await Pact.fetch.listen(
    { listen: response.requestKeys[0] },
    API_HOST,
  );
  console.log('Transaction mined!');
  console.log(txResult);
}
```

### Read State

```typescript title="Read state of a contract"
const HELP = 'Usage example: \n\nnode read-state';
const Pact = require('pact-lang-api');
const NETWORK_ID = 'testnet04';
const CHAIN_ID = '1';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const creationTime = () => Math.round(new Date().getTime() / 1000);

if (process.argv.length !== 2) {
  console.info(HELP);
  process.exit(1);
}

getState();

async function getState() {
  const account =
    'f6b0e0d0bcae2e397104e0f6536492f01ce35977eb6fe5868a0efaff556bf80b';
  const cmd = {
    pactCode: `(coin.details "${account}")`,
    meta: {
      creationTime: creationTime(),
      ttl: 600,
      gasLimit: 20,
      gasPrice: 0,
      chainId: CHAIN_ID,
      sender: '',
    },
  };
  const result = await Pact.fetch.local(cmd, API_HOST);
  console.log(result);
}
```

### Verify Signature

```typescript title="Verify a key pair signature"
const Pact = require('pact-lang-api');

const KEY_PAIR = Pact.crypto.genKeyPair();

verifySig();

function verifySig() {
  const msg = 'Hi from Kadena';
  const result = Pact.crypto.sign(msg, KEY_PAIR);

  const isValid = Pact.crypto.verifySig(
    Pact.crypto.hashBin(msg),
    Pact.crypto.hexToBin(result.sig),
    Pact.crypto.hexToBin(KEY_PAIR.publicKey),
  );

  isValid
    ? console.log('Signature is valid!')
    : console.log('Signature is invalid!');
}
```
