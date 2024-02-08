---
title: Pact REST API
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: Pact REST API
label: Pact REST API
order: 2
layout: full
tags: ['pact', 'rest api', 'pact api', 'pact api reference']
---

# Pact REST API

See [/pact/api](/pact/api) for latest OpenAPI docs.

### Pact built-in server

Pact ships with a built-in HTTP server and SQLite backend. To start up the
server issue `pact -s config.yaml`, with a suitable config.

### pact-lang-api JS Library

The `pact-lang-api` JS library is
[available via npm](https://www.npmjs.com/package/pact-lang-api) for web
development.

### API request formatter

The `pact` tool accepts the `-a` option to format API request JSON, using a YAML
file describing the request. The output can then be used with a POST tool like
Postman or even piping into `curl`.

For instance, a yaml file called "apireq.yaml" with the following contents:

```yaml
code: '(+ 1 2)'
data:
  name: Stuart
  language: Pact
keyPairs:
  - public: ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d
    secret: 8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332
```

can be fed into `pact` to obtain a valid API request:

```bash
$ pact -a tests/apireq.yaml -l
{"hash":"444669038ea7811b90934f3d65574ef35c82d5c79cedd26d0931fddf837cccd2c9cf19392bf62c485f33535983f5e04c3e1a06b6b49e045c5160a637db8d7331","sigs":[{"sig":"9097304baed4c419002c6b9690972e1303ac86d14dc59919bf36c785d008f4ad7efa3352ac2b8a47d0b688fe2909dbf392dd162457c4837bc4dc92f2f61fd20d","scheme":"ED25519","pubKey":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d","addr":"ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d"}],"cmd":"{\"address\":null,\"payload\":{\"exec\":{\"data\":{\"name\":\"Stuart\",\"language\":\"Pact\"},\"code\":\"(+ 1 2)\"}},\"nonce\":\"\\\"2017-09-27 19:42:06.696533 UTC\\\"\"}"}

```

Here's an example of piping into curl, hitting a pact server running on port
8080:

```bash
$ pact -a tests/apireq.yaml -l | curl -d @- http://localhost:8080/api/v1/local
{"status":"success","response":{"status":"success","data":3}}
```

### Request YAML file format

Request yaml files takes two forms. An _execution_ Request yaml file describes
the [exec](/pact/api) payload. Meanwhile, a _continuation_ Request yaml file
describes the [cont](/pact/api) payload.

#### YAML exec command request

The execution request yaml for a public blockchain takes the following keys:

```yaml
  code: Transaction code
  codeFile: Transaction code file
  data: JSON transaction data
  dataFile: JSON transaction data file
  keyPairs: list of key pairs for signing (use pact -g to generate): [
    public: base 16 public key
    secret: base 16 secret key
    caps: [
      optional managed capabilities
      ]
    ]
  nonce: optional request nonce, will use current time if not provided
  networkId: string identifier for a blockchain network
  publicMeta:
    chainId: string chain id of the chain of execution
    sender: string denoting the sender of the transaction
    gasLimit: integer gas limit
    gasPrice: decimal gas price
    ttl: integer time-to-live value
    creationTime: optional integer tx execution time after offset
  type: exec
```

#### YAML Continuation command request

The continuation request yaml for a public blockchain takes the following keys:

```yaml
  pactTxHash: integer transaction id of pact
  step: integer next step of a pact
  rollback: boolean for rollingback a pact
  proof: string spv proof of continuation (optional, cross-chain only)
  data: JSON transaction data
  dataFile: JSON transaction data file
  keyPairs: list of key pairs for signing (use pact -g to generate): [
    public: string base 16 public key
    secret: string base 16 secret key
    caps: [
      optional managed capabilities
      ]
    ]
  networkId: string identifier for a blockchain network
  publicMeta:
    chainId: string chain id of the chain of execution
    sender: string denoting the sender of the transaction
    gasLimit: integer gas limit
    gasPrice: decimal gas price
    ttl: integer time-to-live value
    creationTime: optional integer tx execution time after offset
  nonce: optional request nonce, will use current time if not provided
  type: cont
```

Note that the optional "proof" field only makes sense when using cross-chain
continuations.

## Signing Transactions

As of Pact 3.5.0, the `pact` command line tool now has several commands to
facilitate signing transactions. Here's a full script showing how these commands
can be used to prepare an unsigned version of the transaction and add signatures
to it. This transcript assumes that the details of the transaction has been
specified in a file called `tx.yaml`.

```pact
# At some earlier time generate and save some public/private key pairs.
pact -g > alice-key.yaml
pact -g > bob-key.yaml

# Convert a transaction into an unsigned prepared form that is signatures can be added to
pact -u tx.yaml > tx-unsigned.yaml

# Sign the prepared transaction with one or more keys
cat tx-unsigned.yaml | pact add-sig alice-key.yaml > tx-signed-alice.yaml
cat tx-unsigned.yaml | pact add-sig bob-key.yaml > tx-signed-bob.yaml

# Combine the signatures into a fully signed transaction ready to send to the blockchain
pact combine-sigs tx-signed-alice.yaml tx-signed-bob.yaml > tx-final.json

```

The `add-sig` command takes the output of `pact -u` on standard input and one or
more key files as command line arguments. It adds the appropriate signatures to
to the transaction and prints the result to stdout.

The `combine-sigs` command takes multiple unsigned (from `pact -u`) and signed
(from `pact add-sig`) transaction files as command line arguments and outputs
the command and all the signatures on stdout.

Both `add-sig` and `combine-sigs` will output YAML if the output transaction
hasn't accumulated enough signatures to be valid. If all the necessary
signatures are present, then they will output JSON in final form that is ready
to be sent to the blockchain on the [`/send` endpoint](/pact/api). If you would
like to do a test run of the transaction, you can use the `-l` flag to generate
output suitable for use with the [`/local` endpoint](/pact/api).

The above example adds signatures in parallel, but the `add-sig` command can
also be used to add signatures sequentially in separate steps or all at once in
a single step as shown in the following two examples:

```
cat tx-unsigned.yaml | pact add-sig alice-key.yaml | pact add-sig bob-key.yaml
cat tx-unsigned.yaml | pact add-sig alice-key.yaml add-sig bob-key.yaml
```

### Offline Signing with a Cold Wallet

Some cold wallet signing procedures use QR codes to get transaction data on and
off the cold wallet machine. Since QR codes can transmit a fairly limited amount
of information these signing commands are also designed to work with a more
compact data format that doesn't require the full command to generate
signatures. Here's an example of what `tx-unsigned.yaml` might look like in the
above example:

```yaml
hash: KY6RFunty4WazQiCsKsYD-ovu-_XQByfY6scTxi9gQQ
sigs:
  368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca: null
  6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7: null
cmd:
  '{"networkId":"mainnet01","payload":{"exec":{"data":{"ks":{"pred":"keys-all","keys":["368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca"]}},"code":"(coin.transfer-create
  \"alice\" \"bob\" (read-keyset \"ks\") 100.1)\n(coin.transfer \"bob\"
  \"alice\"
  0.1)"}},"signers":[{"pubKey":"6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7","clist":[{"args":["alice","bob",100.1],"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]},{"pubKey":"368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca","clist":[{"args":["bob","alice",0.1],"name":"coin.TRANSFER"}]}],"meta":{"creationTime":1580316382,"ttl":7200,"gasLimit":1200,"chainId":"0","gasPrice":1.0e-5,"sender":"alice"},"nonce":"2020-01-29
  16:46:22.916695 UTC"}'
```

To get a condensed version for signing on a cold wallet all you have to do is
drop the `cmd` field. This can be done manually or scripted with
`cat tx-unsigned.yaml | grep -v "^cmd:"`. The result would look like this:

```yaml
hash: KY6RFunty4WazQiCsKsYD-ovu-_XQByfY6scTxi9gQQ
sigs:
  368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca: null
  6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7: null
```

Keep in mind that when you sign these condensed versions, you won't be able to
submit the output directly to the blockchain. You'll have to use `combine-sigs`
to combine those signatures with the original `tx-unsigned.yaml` file which has
the full command.

### Detached Signature Transaction Format

The YAML input expected by `pact -u` is similar to the
[Public Blockchain YAML format](/pact/reference/rest-api#detached-signature-transaction-formath-260011505)
described above with one major difference. Instead of the `keyPairs` field which
requires both the public and secret keys, `pact -u` expects a `signers` field
that only needs a public key. This allows signatures to be added on
incrementally as described above without needing private keys to all be present
when the transaction is constructed.

Here is an example of how the above `tx.yaml` file might look:

```yaml
code: |-
  (coin.transfer-create "alice" "bob" (read-keyset "ks") 100.1)
  (coin.transfer "bob" "alice" 0.1)
data:
  ks:
    keys: [368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca]
    pred: 'keys-all'
publicMeta:
  chainId: '0'
  sender: alice
  gasLimit: 1200
  gasPrice: 0.0000000001
  ttl: 7200
networkId: 'mainnet01'
signers:
  - public: 6be2f485a7af75fedb4b7f153a903f7e6000ca4aa501179c91a2450b777bd2a7
    caps:
      - name: 'coin.TRANSFER'
        args: ['alice', 'bob', 100.1]
      - name: 'coin.GAS'
        args: []
  - public: 368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca
    caps:
      - name: 'coin.TRANSFER'
        args: ['bob', 'alice', 0.1]
type: exec
```
