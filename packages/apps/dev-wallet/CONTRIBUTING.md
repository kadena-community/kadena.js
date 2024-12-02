# Contributing

## Architecture

IndexedDB is used to store the data.  
There are **repositories** to access the data  
There are **services** to interact with the repositories  
The repositories and services are bundled into **modules**

### Modules

We have the following modules:

- `account` - for account management
- `activity` - for activity management like transfers, draft transfers, signing
  requests
- `key-source` - for key management
- `network` - for network management like mainnet01, testnet04, custom networks
- `transaction` - for transaction management
- `wallet` - for key-derivation management

### Sensitive values

Any value that is sensitive is stored in the `encryptedValue` table. The value
can be linked throuhg the `UUID` which is stored in the `secretId` property of
the related entity.

### ERD

In the dev-wallet we're using IndexedDB to store the data. The following is the
ERD for the database.

```mermaid
erDiagram

  profile {
    UUID uuid
    string name
    string secretId
    string accentColor
    string options
  }

  encryptedValue {
    UUID id
    string value
  }

  keySource {
    UUID uuid
    UUID profileId
    string source
    string derivationPathTemplate
    string keys
    string secretId
  }

  account {
    UUID uuid
    string address
    UUID keysetId
    UUID profileId
    UUID networkUUID
    string contract
    string chains
    string overallBalance
    string creationTime
  }

  network {
    UUID uuid
    string networkId
    string name
    boolean default
    string faucetContract
    string hosts
  }

  fungible {
    string contract
    string title
    string symbol
    string interface
    string chainIds
    string creationTime
  }

  keyset {
    UUID uuid
    UUID profileId
    string principal
    string guard
    string creationTime
  }

  transaction {
    UUID uuid
    string hash
    UUID profileId
    UUID groupId
    UUID networkUUID
    string status
    string cmd
    string sigs
    string preflight
    string request
    string result
  }

  activity {
    UUID uuid
    UUID profileId
    UUID keysetId
    UUID networkUUID
    string status
    string type
    string data
    string creationTime
  }

  profile ||--o{ keySource : "profileId"
  profile ||--o{ account : "profileId"
  profile ||--o{ keyset : "profileId"
  profile ||--o{ transaction : "profileId"
  profile ||--o{ activity : "profileId"
  encryptedValue ||--o{ keySource : "secretId"
  encryptedValue ||--o| profile : "secretId"

  account ||--o{ transaction : "has"
  network ||--o{ account : "has"
  network ||--o{ transaction : "has"
  fungible ||--o{ transaction : "has"
  keyset ||--o{ account : "has"
  keyset ||--o{ activity : "has"
  activity ||--o{ transaction : "has"

```
