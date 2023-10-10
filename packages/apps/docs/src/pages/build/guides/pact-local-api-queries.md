---
title: Pact Local API queries
description: Pact Local API queries
menu: Build
label: Pact Local API queries
order: 2
layout: full
tags: [pact, tutorial, local api]
---

# Pact Local API queries

Chainweb supports the use of the Pact smart contract language, including the
`local` API endpoints defined in
[the documentation](https://pact-language.readthedocs.io/en/stable/pact-reference.html#rest-api).
Using the `local` API endpoints on any Chainweb node, you can dry-run Pact smart
contracts using actual data in the coin contract tables. This is perfect for
checking the viability of your smart contracts, as well as to check account data
without necessarily having to spend tokens!

### Setup

Follow the instructions at the [Welcome to Pact](/pact/beginner) section to get
started with Pact learning the basics. For a more straightforward and technical
introduction, just [readthedocs](https://pact-language.readthedocs.io).

In particular, for any script going on Chainweb, you'll need to understand the
[API request format](https://pact-language.readthedocs.io/en/stable/pact-reference.html#api-request-formatter).

### Creating A Local API Request

A `local` query does not need to make use of any metadata, env data, or signers,
so a minimalist API request format is relatively simple:

```pact title=" "
(code|codeFile): <code goes here>
keyPairs: []
```

For example, if one wanted to check their balance, the following request format
would be sufficient:

```pact title=" "
code: (coin.get-balance "<account name>")
keyPairs: []
```

Once one has such a yaml, issue `pact -l -a <my-script-name>.yaml`. The
following output should look something like this:

```typescript title=" "
{"hash":"<some hash>","sigs":[],"cmd":"{\"networkId\":null,\"payload\":{\"exec\":{\"data\":null,\"code\":\"(coin.get-balance \\\"<account-name>\\\")\"}},\"signers\":[],\"meta\":{\"creationTime\":0,\"ttl\":0,\"gasLimit\":0,\"chainId\":\"\",\"gasPrice\":0,\"sender\":\"\"},\"nonce\":\"2019-11-03 01:58:38.266437 UTC\"}"}
```

You can see that most entries are null, and the metadata has been stubbed out
for you. If you wish to enter explicit entries for any of these fields, you are
welcome, but they will not be used. It is, however, a great way to practice.

### Sending the Command to Chainweb

Once one has a command at the ready, they may send it as JSON using their
favorite program to the `local` pact endpoint of any Chainweb node on a chain
where the account exists. Using the `us-e2` bootstrap node as an example,
sending to the local endpoint looks something like the following:

```pact title=" "
curl -X POST \
  https://us-e2.chainweb.com/chainweb/0.0/mainnet01/chain/0/pact/api/v1/local \
  -H 'Content-Type: application/json' \
  -d '{"hash":"SLxYfnaUCH4XjzdK7e4i0Keo3UMjX8axXFp54jT9xS4","sigs":[{"sig":"b1ce5740c230779ae28d28e6f838fe79dfde00f8443f77a1082d302fe55906d56165ce096234ce870dff03e62ee741460230892b0aadf6ae5e29ae0d2984b80f"}],"cmd":"{\"networkId\":\"mainnet01\",\"payload\":{\"exec\":{\"data\":null,\"code\":\"(coin.details \\\"ff5f5b2ca782a7586292507bddebdf89a3df1e7438071ee98fd3c09abdb53ea4\\\")\"}},\"signers\":[{\"pubKey\":\"0f5fbfa90eadd843f18c6ecefc7691926073767f5abf33ef9dbf997fe544c775\"}],\"meta\":{\"creationTime\":0,\"ttl\":100000,\"gasLimit\":1000,\"chainId\":\"3\",\"gasPrice\":1.0e-2,\"sender\":\"emily\"},\"nonce\":\"2019-11-02 01:15:52.46679 UTC\"}"}'
```

If this call is successful, then a result is returned immediately with the
requested data:

```typescript title=" "
{
   "gas":0,
   "result":{
      "status":"success",
      "data":{
         "guard":{
            "pred":"keys-all",
            "keys":[
               "ff5f5b2ca782a7586292507bddebdf89a3df1e7438071ee98fd3c09abdb53ea"
            ]
         },
         "balance": <some decimal number here>,
         "account":"ff5f5b2ca782a7586292507bddebdf89a3df1e7438071ee98fd3c09abdb53ea4"
      }
   },
   "reqKey":"SLxYfnaUCH4XjzdK7e4i0Keo3UMjX8axXFp54jT9xS4",
   "logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
   ...
}
```

And voilá! You have your balance.

### Automating Pact Local calls

The community has provided some wonderful scripts to automate this process, and
more are always welcome. Especially if they are robust. Here are a few:

- [@jwiegley](https://github.com/jwiegley)'s script can be seen
  [here](https://discordapp.com/channels/502858632178958377/638740469127446538/639926087090044960)

More are welcome. Make sure to ping us when you come up with something so we can
add it to the Pact script hall of fame!
