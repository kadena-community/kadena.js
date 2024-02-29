# composePactCommand utilities

## `payload.exec`

creating exec payload

<details>
<summary>examples</summary>

```TypeScript
import Pact from "@kadena/client"

// importing coin module that you can generate types of that by using "pactjs-cli"
const { coin } = Pact.modules;

const command = composePactCommand(
  execution(
    coin.transfer("bob", "alice", { decimal: "1.1" })
  )
)()

//
const command = {
  payload: {
    code: '(coin.transfer "bob" "alice" 1.1)'
  }
}
```

</details>

## `payload.cont`

creating continuation command

<details>
<summary>examples</summary>

```TypeScript
const command = composePactCommand(
  continuation({
    pactId: '1',
    proof: 'test-proof',
    step: 1,
  })
)()

//
const command = {
  payload: {
    pactId: '1',
    proof: 'test-proof',
    step: 1,
  }
}
```

</details>

## `addSigner`

add a signer and capabilities they sign for, to the command it also uses the the
typing from the payload part and recommends the relevant capabilities

| parameter          | type                                                                                     | description                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| signer             | string \| { pubKey: string; scheme?: 'ED25519' \| 'ETH' \| 'WebAuthn', address?:string } | public key of the signer or object including publicKey, schema, and address                |
| capabilityCallBack | (withCapability)=> ICap[]                                                                | it gives withCapability function to users in order to add capabilities to the signer part. |

<details>
<summary>examples</summary>

```TypeScript
const command = composePactCommand(
  execution(
    coin.transfer("bob", "alice", { decimal: "1.1" })
  ),
  addSigner("bob_public_key",(withCapability)=>[
    withCapability("coin.TRANSFER", "bob", "alice", { decimal: "1.1" })
  ])
)()

//
const command = {
  payload: {
    code: '(coin.transfer "bob" "alice" 1.1)'
  },
  signers:[
    {
      pubKey: "bob_public_key",
      schema: "ED25519"
      clist:[{
        name: "coin.TRANSFER",
        args:['"bob"', '"alice"', "1.1"]
      }]
    }
  ]
}

```

</details>

## `readKeyset`

return `(read-keyset "name")` string, useful when generating code.

<details>
<summary>examples</summary>

```TypeScript
const command = composePactCommand(
  execution(
    coin.transfer(readKeyset("sender_key"), "bob", { decimal: "1.1" })
  ),
)()

//
const command = {
  payload: {
    code : `(coin.transfer (read-keyset "sender_key") "bob" 1.1)`
  }
}

```

</details>

## `addData`

adds data to the payload part

| parameter | type                                  | description                         |
| --------- | ------------------------------------- | ----------------------------------- |
| name      | string                                | name of the data that you can refer |
| data      | object \| string \| number \| boolean | The data you want to add            |

<details>
<summary>examples</summary>

```TypeScript
const command = composePactCommand (
  execution(
    coin.transfer("bob", "alice", { decimal: "1.1" })
  ),
  addData("name", { value: "test" }),
)()

//
const command = {
  payload: {
    code: '(coin.transfer "bob" "alice" 1.1)'
    data: {
      name : {
        value : "test"
      }
    }
  },
}

```

</details>

## `addKeyset`

add keyset to the data part

| parameter     | type                                           | description                                  |
| ------------- | ---------------------------------------------- | -------------------------------------------- |
| name          | string                                         | name of the keyset                           |
| pred          | "keys-all" \| "keys-any" \| "keys-2" \| string | type of pred                                 |
| ...publicKeys | string[]                                       | list of the public keys to add to the keyset |

<details>
<summary>examples</summary>

```TypeScript
const command = composePactCommand(
  execution(
    coin.transfer(readKeyset("senderKey"), "bob", { decimal: "1.1" })
  ),
  addKeyset("senderKey","keys-any", "the_public_key")
)()

//
const command = {
  payload: {
    code: `(coin.transfer (read-keyset "sender_key") "bob" 1.1)`
    data: {
      senderKey: {
        publicKeys: ['the_public_key'],
        pred: "keys-any"
      }
    }
  }
}

```

</details>

## `setMeta`

returns meta section of the command

<details>
<summary>examples</summary>

```TypeScript
const command = composePactCommand(
  execution(
    coin.transfer("alice", "bob", { decimal: "1.1" })
  ),
  setMeta({ chainId : "1" }),
)()

//
const command = {
   payload: {
    code: '(coin.transfer "bob" "alice" 1.1)'
  },
  meta:{
    chainId: "1",
    gasLimit: 2500,
    gasPrice: 1.0e-8,
    sender: '',
    ttl: 8 * 60 * 60, // 8 hours,
    creationTime: Math.floor(Date.now() / 1000),
  }
}
```

</details>

## `setProp`

A general helper to add a section.

<details>

<summary>examples</summary>

```TypeScript

const command = composePactCommand(
  execution(
    coin.transfer("alice", "bob", { decimal: "1.1" })
  ),
  setProp("networkId", "mainnet01"),
  setProp("nonce", `k:none:${Date.now()}`),
)()

//
const command = {
   payload: {
    code: '(coin.transfer "bob" "alice" 1.1)'
  },
  networkId: "mainnet01",
  nonce: "k:none:1232123123",
}

```

</details>
