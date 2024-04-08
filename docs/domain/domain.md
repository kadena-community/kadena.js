## Domain model

Explanation of the entities with their properties and the relations between them
([see also](https://www.ictdemy.com/software-design/uml/uml-domain-model)).  
The relations describe their cardinality and how they are related.

- `<>` open diamond: association, they can exist independently or relate to each
  other
- `<>` filled diamond: composition, the child cannot exist without the parent
- `|>` open arrow: generalization, the child is a specialization of the parent
- `--` line: association, the entities are related

Bike shedding:

- `sender` vs `gaspayer`
- `data` for transaction, what does it mean, adds scope
- use of the word `guard`
-

```mermaid
---
title: Chainweb Domain Model
---
classDiagram

  class Transaction {
    code
    data
    chainId
    gasLimit
    gasPrice
    creationTime
    timeToLive
    hash
  }

  class Signer {
    publicKey
    address
    Scheme
    capabilities
  }

  class Signature {
    signature
  }

  class Capability {
    name
    arguments
  }

  class Block {
    creationTime
    epochStart
    height
    chainId
    featureFlags
    payloadHash
    transactionsHash
    outputsHash
    networkId
    nonce
    weight
    target
  }

  class Chain {
    chainId
  }

  class TransactionExecution {
    requestKey
    logs
    gas
    result
    data
    transactionId
  }

  class Fungible {
    accountName
  }
  <<interface>> Fungible

  class CoinAccount { }

  class KeySet {
    predicate
    publicKeys
  }

  class Guard { }
  <<interface>> Guard

  Transaction "1" *-- "0..*" Signer : signed by
  Transaction "1" *-- "0..*" Signature : signed with
  Signature "1" -- "0..*" Capability : grants
  Transaction "1" *-- "1" CoinAccount : send by (payed gas)
  Fungible --|> CoinAccount
  Signer "1" -- "0..*" Capability : signs for
  Signer "1" -- "0..*" Signature : produces
  Block "1" -- "0..*" Block : orphan
  Block "1" -- "1" Block : parent
  Block "1" -- "0..*" TransactionExecution : contains
  Block "1..*" -- "1" CoinAccount : miner
  Chain "1" -- "3..*" Chain : neighbor
  CoinAccount "1" -- "1" Guard : guarded by
  Transaction "1" *-- "0..*" TransactionExecution : appears in
  Block --* Chain
  Guard --|> KeySet

```
