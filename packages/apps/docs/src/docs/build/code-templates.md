---
title: Code templates for common use cases
description: Provides TypeScript and Pact code templates for performing common tasks with Pact and the Kadena client.
menu: Code templates
label: Code templates
order: 3
layout: full
tags: [pact, typescript, account, transactions, utils]
---

# Code templates

You can use the TypeScript and Pact sample code in this section as templates for performing common tasks with the Kadena client libraries and Pact API.

## Create a Kadena account

Create a new Kadena account on a chain without transferring any digital assets (KDA) into it.

```typescript title="Create a new account."
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

## Create and fund a Kadena account

Create and fund a new Kadena account on a chain by transferring digital assets (KDA) into it.

```typescript title="Create and fund a Kadena account."
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

## Rotate keys

Update the keyset controlling the account.

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

## Get an account balance

Get the KDA account balance.

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

## Get transaction status

Get transaction status using Tx request key.

```typescript title="Get transaction status using the transaction request key."
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

## Deploy a contract

Deploy a Pact smart contract.

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

## Read state

Read state of a contract.

```typescript title="Read the state of a contract."
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

## Verify a signature

Verify a key pair signature.

```typescript title="Verify a key pair signature."
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

## Safe transfers

With many cryptocurrencies, users risk losing their funds if they make a mistake typing the public key they are transferring funds to because their private key can't access the funds after they are transferred using the incorrect public key.

Pact allows you to construct transfer transactions that guarantee:

- Someone possesses the correct private key.
- The private key will be able to access the funds being transferred. 

To provide this guarantee, you can construct a single transaction to execute two separate transfer operations:

- One transfer from `alice` to `bob` for the desired amount plus a small amount extra coins for a test transfer.
- One transfer from `bob` to `alice` to return the extra coins used to verify the account owner.

This type of transaction must be signed by both the `alice` and `bob` accounts and each signature must have the appropriate `coin.TRANSFER` capability. 
It's especially important to construct this type of transaction when you are using the `transfer-create` function because that is when you are defining the new account's keyset.

In this example:

- The public key for the account `alice` is `6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7`.
- The public key for `bob` is `368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca`.

```pact title="Transfer coins in a safe transaction."
code: |-
  (coin.transfer-create "alice" "bob" (read-keyset "ks") 200.1)
  (coin.transfer "bob" "alice" 0.1)
data:
  ks:
    keys: [368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: alice
  gasLimit: 1200
  gasPrice: 0.00001
  ttl: 7200
networkId: "mainnet01"
signers:
  - public: 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7
    caps:
      - name: "coin.TRANSFER"
        args: ["alice", "bob", 200.1]
      - name: "coin.GAS"
        args: []
  - public: 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca
    caps:
      - name: "coin.TRANSFER"
        args: ["bob", "alice", 0.1]
type: exec
```

## Safe rotate and drain

This sample code illustrates how to rotate keys and transfer funds in a single transaction.
In this example, the account named `rotest` is owned by the public key
`2993f795d133fa5d0fd877a641cabc8b28cd36147f666988cacbaa4379d1ff93`.
The transaction code:
- Rotates ownership to the public key `dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025`.
- Transfers the whole balance from  the `rotest` account to the `croesus` account. - Pays the transaction fee from the `croesus` account to drain the `rotest` account balance to zero. 

This transaction must be signed by both the key that owns the `rotest` account at the beginning and the key that owns the `croesus` at the end.
Because the transfer out of the `rotest` account occurs after the key is rotated, the transaction must be signed by the key you are rotating to. 
With this transaction, it's impossible to accidentally rotate to an incorrect key and lose control of the `rotest` account.

```pact title="Rotate keys and drain an account."
code: |-
  (use coin)
  (let* ((acct:string "rotest")
         (bal:decimal (coin.get-balance acct))
        )
    (coin.rotate acct (read-keyset "ks"))
    (coin.transfer acct
      "croesus"
      bal)
  )
data:
  ks:
    keys: [dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025]
    pred: "keys-all"
publicMeta:
  chainId: "0"
  sender: croesus
  gasLimit: 800
  gasPrice: 0.00001
  ttl: 86400
networkId: "testnet04"
signers:
  - public: 2993f795d133fa5d0fd877a641cabc8b28cd36147f666988cacbaa4379d1ff93
    caps:
      - name: coin.GAS
        args: []
      - name: coin.ROTATE
        args: ["rotest"]
  - public: dea647009295dc015ba6e6359b85bafe09d2ce935a03c3bf83f775442d539025
    caps:
      - name: coin.TRANSFER
        args: ["rotest","croesus",100]
type: exec
```
