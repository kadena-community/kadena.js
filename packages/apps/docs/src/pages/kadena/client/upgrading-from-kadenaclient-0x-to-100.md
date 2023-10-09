---
title: Upgrading from @kadena/client 0.x to 1.0.0
description: Kadena makes blockchain work for everyone.
menu: Upgrading from @kadena/client 0.x to 1.0.0
label: Upgrading from @kadena/client 0.x to 1.0.0
order: 8
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/client/README.md
layout: full
tags: [javascript, typescript, signing, transaction, typescript client]
lastModifiedDate: Tue, 19 Sep 2023 09:58:38 GMT
---

# Upgrading from @kadena/client 0.x to 1.0.0

The highlights of the difference between 0.x and 1.0.0 are:

- the expression generation is separate from transaction building. This allows
  for multiple statements per transaction
- the client is it's own separate entity
- signing is applied on a vanilla JS Object

Here are two examples of old to new rewrites

- [Sending a `coin.transfer` transaction](/kadena/client/upgrading-from-kadenaclient-0x-to-100#sending-a-transaction-transfer)
- [Reading balance using `coin.get-balance`](/kadena/client/upgrading-from-kadenaclient-0x-to-100#read-from-the-blockchain-getbalance)

### Sending a transaction 'transfer'

Old implementation

```ts
async function transaction(
  sender: string,
  senderPublicKey: string,
  receiver: string,
  amount: IPactDecimal,
): Promise<void> {
  const unsignedTransaction = Pact.modules.coin
    .transfer(sender, receiver, amount)
    .addCap('coin.GAS', senderPublicKey)
    .addCap('coin.TRANSFER', senderPublicKey, sender, receiver, amount)
    .setMeta({ senderAccount: sender }, 'testnet04');

  const res = await signWithChainweaver(unsignedTransaction);

  const sendRequests = res.map((tx) => {
    console.log('sending transaction', tx.code);
    return tx.send(testnetChain1ApiHost);
  });

  const sendResponses = await Promise.all(sendRequests);
  sendResponses.map(async function (sendResponse: SendResponse): Promise<void> {
    const requestKey = (await sendRequests[0]).requestKeys[0];
    await pollMain(requestKey);
    console.log(`Transaction '${requestKey}' finished`);
  });
}

async function pollMain(...requestKeys: string[]): Promise<void> {
  // ... some code to poll the status of the requestKeys
}
```

New implementation

```ts
const NETWORK_ID: string = 'testnet04';

async function transfer(
  sender: string,
  senderPublicKey: string,
  receiver: string,
  amount: IPactDecimal,
): Promise<void> {
  const transaction = Pact.builder
    .execution(
      // pact expression
      Pact.modules.coin.transfer(sender, receiver, amount),
    )
    // add signers
    .addSigner(senderPublicKey, (withCapability) => [
      // add capabilities
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', sender, receiver, amount),
    ])
    // set chainId and sender
    .setMeta({ chainId: '0', senderAccount: sender })
    .setNetworkId(NETWORK_ID)
    // will create a IUnsignedTransaction { cmd, hash, sigs }
    .createTransaction();

  const signedTx = await signWithChainweaver(transaction);

  // create generic client
  const client = createClient(apiHostGenerator);

  // check if all necessary signatures are added
  if (isSignedTransaction(signedTx)) {
    const transactionDescriptor = await client.submit(signedTx);
    const response = await client.listen(transactionDescriptor, {});
    if (response.result.status === 'failure') {
      throw response.result.error;
    } else {
      console.log(response.result);
    }
  }
}

transfer(senderAccount, senderPublicKey, receiverAccount, {
  decimal: '13.37',
}).catch(console.error);
```

### Read from the blockchain 'getBalance'

Old implementation

```ts
async function getBalance(account: string): Promise<void> {
  // generation of transaction and expression as one, and the client is part of the transaction
  const res = await Pact.modules.coin['get-balance'](account).local(
    'http://host.com/chain/0/pact',
  );
  console.log(res);
}

const myAccount: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';

getBalance(myAccount).catch(console.error);
```

New implementation:

```ts
async function getBalance(account: string): Promise<void> {
  // `Pact.builder.execution` accepts a number of `Pact.modules.<module>.<fun>` calls
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId: '1' })
    .createTransaction();

  // client creation is separate from the transaction builder
  const staticClient = createClient('http://host.com/chain/0/pact');
  const genericClient = createClient(
    ({ networkId, chainId }) =>
      `http://${networkId}.host.com/chain/${chainId}/pact`,
  );

  const res = await staticClient.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  console.log(res);
}

getBalance(account).catch(console.error);
```
