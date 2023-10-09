# Transaction

You need to do these three steps to successfully submit a transaction to the
blockchain.

- Building a command
- Signing
- submit the transaction

## Building a Command

A command is what you want from the blockchain, the most important part of a
command is the `code` thats just a pact code (check out the [pact
documentation][1]). Even though asking `(+ 1 1)` from the blockchain is
completely a valid command but Perhaps this is not the thing you want to pay gas
for, unless you need the consensus for the answer :). Most of the time you will
call some functions from smart contracts. For example
`(coin.transfer "bob" "alice" 1.1)` calls the transfer function form the coin
contract. you even can call several functions in one code, that lets you to
define a custom logic, for example let's consider bob wants to pay 1 KDA to
alice and in contrast alice will transfer the administration of the
free.theContract to bob. the code is like that

```Lisp
(coin.transfer "bob" "alice" 1)
(free.theContract.transferAdmin("alice" "bob"))
```

Its worth nothing that pact runs this as an atomic transaction. so bob and alice
can make sure that both transfers happen or are failed.

The complete example of the command is like this

```Typescript
{
  "payload":{
    "code": '(coin.transfer "bob" "alice" 1)(free.theContract.transferAdmin "alice" "bob")',
    // the environment variable for send via the command, (e.g. keysets)
    "data": "{}"
  },
  // list of the signers and the capabilities that they sign for
  "singers":[{
    "publicKey":"bob_public_key",
    "scheme": 'ED25519'
    "clist":[
      {
        name:"coin.TRANSFER",
        args:["bob", "alice", 1],
      }
    ]
  },{
    "publicKey":"alice_public_key",
    "scheme": 'ED25519'
    "clist":[
      {
        name:"free.theContract.ADMIN",
        args:[],
      }
    ]
  }],
  "networkId":"testnet04",
  "nonce":"test-nonce",
  "meta":{
    "chainId":"1",
    // if the gas payer is someone else but the transaction signers
    "sender": "gas_payer-public_key";
    "gasLimit": 100;
    "gasPrice": 200;
    "ttl": 1000;
    "creationTime": 121312312312;
  }
}
```

### What is the `clist` (capability list)

In Pact every signer can scope their signature to some capabilities by adding
them in the clist array. Based on the functions you call, you might need to add
some capabilities into this list otherwise the transaction fails. you can read
[What is capability][2].

## Signing

After generating the command you need to sign it with the private keys pair with
the public keys in the signers array. the command need to be signed by all
parties in the transaction. Usually signing happens via the wallet application
but the end you need to create a JSON like this in order to send it to the
blockchain

```JSON
{
  "cmd": "stringify-version-of-command",
  "hash": "hash of cmd",
  "sigs":["sig1","sig2","sig3"]
}
```

[1]: https://pact-language.readthedocs.io/en/stable/
[2]: https://pact-manual.readthedocs.io/en/latest/source/capabilities/
