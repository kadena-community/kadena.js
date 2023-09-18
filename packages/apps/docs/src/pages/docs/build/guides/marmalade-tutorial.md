---
title: Marmalade Tutorial
description: Marmalade Tutorial
menu: Build
label: Marmalade Tutorial
order: 1
layout: full
tags: [pact, marmalade, nft, tutorial]
---

# Marmalade Tutorial

## What is Marmalade

[Marmalade](https://marmalade.art/) is the new Kadena standard for NFTs,
addressing a long-standing concern plaguing NFT markets today, which is the
inability to enforce requirements on the sale of NFTs. The Pact language’s
unique “pact” functionality and Marmalade’s modular “policy” based
infrastructure powers this solution, which opens doors to horizons of new ways
to use, build, and trade NFTs.

To learn more about Marmalade try these recommended readings:

1. [Mint a Marketplace! NFTs on Kadena Marmalade (Part 1)](/docs/blogchain/2021/mint-a-marketplace-nfts-on-kadena-marmalade-part-1-2021-12-02.md)
2. [Mint a Marketplace! NFTs on Kadena Marmalade (Part 2)](/docs/blogchain/2021/mint-a-marketplace-nfts-on-kadena-marmalade-part-2-2021-12-03.md)

### What Makes Marmalade Unique

One of the main features of an NFT is the ability to pay royalty to the original
creator with every transaction. This is one of the best appeals for creators to
create an NFT because they can consistently profit off of trades. However, many
protocols only put royalty payments at the exchange it was sold at, instead of
the royalty being based on the transfer price. This structure leads to the
royalty sometimes being not paid or diminished.

Marmalade solves this problem by using pacts, which are multi-step processes
defined in the smart contract. An NFT sale consists of the following:

1. A seller listing an NFT for sale with a price in some coin.
2. A buyer giving the coin to the seller.
3. The seller transferring the NFT to the buyer.

Due to nature of pacts, they ensure that these steps happen in order, completely
eliminating any possibility of an improper transfer or unpaid royalty. This step
by step process, called a policy, can even be defined for cross-chain transfers,
making Marmalade all the more powerful.

### Fungibles Non-fungibles and Poly-fungibles

**Fungibles**: Fungibles are able to replace or be replaced by another identical
item; mutually interchangeable. Money is fungible because one dollar bill is
identical to another dollar bill. In this case, the item itself holds the value.
Other examples of fungibles are cryptocurrencies (such as KDA) and stock
options.

**Non-fungibles**: Non-fungible are items that are not mutually interchangeable
and cannot be replaced by another identical item. The value of a non-fungible is
not tied to the non-fungible itself; rather, it is what comes with the
non-fungible. Non-fungibles typically have unique identifiers and features that
add or subtract value. For example, a dog is non-fungible because it holds
emotional value and cannot be replaced by a dog that looks identical. Baseball
cards, diamonds, and movie tickets are all non-fungibles because they are not
easily interchangeable for other items and have unique properties that make them
different, despite looking the same. Most NFTs are non-fungible.

**Poly-fungibles**: Kadena’s NFTs are poly-fungible. In current Ethereum based
NFTs, creators can create a certain amount of NFTs to put into a marketplace,
and cannot change that amount in the future. Kadena’s NFT protocol, Kip-0013,
allows NFTs to be split into multiple tokens. For example, I can release one NFT
into marmalade, and three years later, I can make that one NFT fracture into 50
fractionalized tokens.

This is the concept of poly-fungibility, the fractionalization of an NFT.
Because of poly-fungibility, creators have the ability to start with scarcity of
a certain NFT in the market by putting out less NFTs, and then update the smart
contract of the NFT to fractionalize it and allow multiple people to own a
scarce NFT. This key feature allows for functionality of concepts like a
decentralized autonomous organization (DAO), where holding a fraction of a NFT
can enter owners into a DAO for managing a certain asset.

### Minting markets

Obviously, creators can create and mint NFTs through Marmalade and Kadena.
However, Marmalade takes minting one step further and allows users to mint
entire marketplaces. Massive collections of NFTs can form “marketplace
communities” by sharing a common approach to ownership and sale in the smart
contract. Since the contracts allow for creation of multiple NFTs, creators can
mint entire marketplaces instead of individual NFTs.

The reason Marmalade allows for this is because Kadena is the only scalable
proof of work blockchain, meaning gas prices will be very low no matter how many
NFTs are minted. This allows creators to create NFTs on a very large scale
without hefty gas prices.

### Tutorial Introduction

Marmalade is a protocol composed of an ecosystem of modules/smart contracts that
are live on the Kadena Chainweb network. In this tutorial, we will be diving
into the details of creating and transacting tokens in this protocol.

#### Marmalade Workflow

The workflow of the Marmalade ecosystem can be broken down to three main steps
that each include few sub steps:

---

**Manifest Creation**

---

**Token Creation and Minting**

![tokenCreationFlow](/assets/docs/178027671-f04ddc6f-29f2-4550-bf95-e2945f6f08b2.png)

**Token Transacting**

![tokenTransactionFlow](/assets/docs/178027707-f5e18e42-e0f8-41a8-8efc-f70726c6b339.png)

## Manifest

The purpose of the manifest is to create the underlying data, called the
manifest, of the token that a creator is going to sell.

**Create URI**: The Manifest starts with creating the URI using the `uri`
function, which has parameters `scheme:string data:string`. This function forces
the user to create an object of proper schema based on the NFT. For example,
suppose we have an image in the JPEG format. The URL of the image would be
inputted for the scheme and data can be the image data in the format of a key.
This would create the URI for the image.

This is what creating the URI of a JPEG image would look like:

```typescript title=" "
;; Create the parameters for the uri function
"uri": {
    "data": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAA..."
   "scheme":"image/jpeg;base64"
}

(uri uri) ;; this is the function call
```

This code is for a JPEG, but it can be replaced with anything else. I could
create my own schema with `"data": "orange"` and `“scheme”: ”marmalade”`.

**Create Datum**: Then, the user creates the datum. The datum is created using
the `create-datum` function, which follows the `mf-datum` schema and takes the
`datum` (in the form of an object) and `uri` as the parameters. The URI is the
same as the URI created in the step before. The datum is some kind of data about
the NFT in the form of an object (objects are created using the following
format: `{“type1”:”data1”, “type2”:”data2”, …}`.

Creating datum can look as follows:

```typescript title=" "
"datum": {
  "assetUrl": "https://dna-tokens-test.s3.us-east-2.amazonaws.com/public/thumb_01680428-36db-46c2-b059-fe59f2ca5a4b.jpeg",
  "creationDate": "2022-02-09",
  "title": "Metal Industrial Complex No.1",
  "artistName": "Jamie McGregor Smith",
  "properties": {
    "medium": "Archival Lambda Colour Print",
    "supply": "5",
    "purchaseLocation": "Direct from Artist",
    "recordDate": "2022-02-09",
    "dimensions": "80x60cm",
    "description": "Signed By Artist And Supplied With Printers Certificate Of
                    Authenticity"
  }
}

(create-datum uri datum) ;; function call
```

**Create Manifest**: This is the final, most crucial step of creating our
token/NFT. The `create-manifest` function takes the URI and data as parameters
and returns the manifest of the token.

```typescript title=" "
(create-manifest uri datum) ;; function call
```

## Token Creation and Minting

**What is a Policy**: The essence of a Marmalade token is its policy. A policy
is the mechanism for the creator to specify their unique requirements for how
their token can be sold. This is what enables the creator to enforce
requirements such as royalties. However, a policy is nothing more than a smart
contract module that is deployed to the Chainweb.

To create a token, the user must deploy their own policy onto the blockchain or
use a policy that has already been deployed to the Chainweb (examples of these
policies below).

Some policies that have already been deployed as part of the Marmalade Ecosystem
are the
[guard policy](https://github.com/kadena-io/marmalade/blob/main/pact/policies/guard-policy/guard-policy.pact),
the
[fixed quote policy](https://github.com/kadena-io/marmalade/blob/main/pact/policies/fixed-quote-policy/fixed-quote-policy.pact),
and the
[fixed quote with royalty policy](https://github.com/kadena-io/marmalade/blob/main/pact/policies/fixed-quote-royalty-policy/fixed-quote-royalty-policy.pact).
All policies, whether they are custom made or already deployed by marmalade,
must conform to a standard interface called kip.token-policy-v1, which can be
viewed
[here](https://github.com/kadena-io/marmalade/blob/main/pact/kip/token-policy-v1.pact).

**Creating a Token**: Creating a token in Marmalade is relatively simple. All
the token creator has to do is call the `create-token` function, which has
parameters of `id` (this is the name of the token), `precision` (this is how you
want to fractionalize your token), `manifest` (the token manifest that we
created earlier), and `policy` (in the form of a module that follows the
kip.token-policy-v1) format.

Before the call, however, we have one more step. The `create-token` function has
a delegated call to the `enforce-init` function in the policy module. Because of
this, we need to pass the execution environment data to the blockchain through
the command call.

This is due to policies’ customizable nature, which allows them to enforce
different parameters. For example, one policy might need an amount for royalty
whereas another might need a specific keyset to allow token purchases.

Here is an example of the creation of a fixed quote policy token:

```typescript title=" "
{
    "hash": "0wNWu4Of36FGGOu5PznASvULdmjn4vsjmaoMGeUl-BM",
    "cmd": "{
"networkId":"testnet04",
"signers":[{"clist":[{"name":"coin.GAS","args":[]}],"pubKey":"e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"}],
"meta":{"creationTime":1655843658,"ttl":28800,"gasLimit":100000,"chainId":"1","gasPrice":0.000001,"sender":"mike.tanto"},
"nonce":""2022-06-21T20:34:33.312Z"",
//This is where to pass in "exec" environment data
//As seen for fixed quote, we need to pass in "mint-guard" "max-supply" "min-amount"


"Payload":{"exec":{"data":
{
"manifest": "some-manifest"
"mint-guard":{"pred":"keys-all","keys":["e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"]},
"Max-supply":"100.0",
"Min-amount":"0.0"
},

//This is the pact function call code;
//read-msg finds the data with appropriate variable name from environment data
"code":"(marmalade.ledger.create-token "MKOCOIN" 12 (read-msg 'manifest) marmalade.fixed-quote-policy)"}}}",
    "sigs": {
        "e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2": null
    }
}
```

Here is an example of the creation of a guard policy token:

```typescript title=" "
{"hash":"-NAUtAL0-xAssDrve6V-dddOUlY-88FBGxlGJHMgid8",
"cmd":"{"networkId":"testnet04","signers":[{"clist":[{"name":"coin.GAS","args":[]}],
"pubKey":"e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"}],
"meta":{"creationTime":1655845010,"ttl":28800,"gasLimit":100000,"chainId":"1","gasPrice":0.000001,"sender":"mike.tanto"},"nonce":""2022-06-21T20:57:05.092Z"",
//This is where to pass in "exec" environment data
//As seen for fixed quote, we need to pass in "mint-guard" "max-supply" "min-amount
"Payload":{"exec":{"data":{ "manifest” : ”some-manifest”, "mint-guard":{"pred":"keys-all","keys":["e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"]},
"Burn-guard":{"pred":"keys-all","keys":["e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"]},
"Sale-guard":{"pred":"keys-all","keys":["e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"]},
"Transfer-guard":{"pred":"keys-all","keys":["e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2"]}},
"code":"(marmalade.ledger.create-token "MKOCOIN" 12 (read-msg 'manifest) marmalade.guard-token-policy)"}}}",
"sigs":{"e6ee763bd659fb2bb4e1f402f338e4bb374b91434f34d5fd49d85e99a00df9e2":null}}
```

**Minting a Token**: Minting is done through the `mint` function, which takes
parameters `id` (token name), `account` (minter account name), `guard` (keyset
of minter), and `amount` (decimal amount to mint).

The function call looks as simple as this:

```typescript title=" "
(mint "MarmaladeCoin" "MarmaladeAccount" some_keyset_guard_object 20000)
```

## Let's Mint in Marmalade!

#### Introduction

A tutorial on minting a PFT with limited supply, fixed quote, and royalty.

marmalade-tutorial.art Token

If you haven’t already, you will need to make a Chainweaver wallet. Go to
[this tutorial](/docs/kadena/wallets/chainweaver) if you need help building one.

### Interplanetary Storage Saving

Although storing data on-chain is possible, and recommended for certain use
cases, to save on-chain storage for this tutorial, we’re making use of another
super cool technology called
[Inter-Planetary-File-System](https://docs.ipfs.io/concepts/what-is-ipfs/) AKA
IPFS, which is a decentralized storage protocol. There are many different IPFS
gateways that can be used such as Infura, Pinata, etc. In this tutorial, we will
be using Pinata due to its ease of use.

1. Visit [Pinata](https://app.pinata.cloud/) and sign up for an account.

![pinataSignup](/assets/docs/178035486-77496792-65c6-4f94-9a2a-429ccb1407b2.png)

1. Once logged in, access the [files page](https://app.pinata.cloud/pinmanager).

![pinataFilePage](/assets/docs/178035521-24e371f1-4033-4101-b024-f7a2140d36b3.png)

1. Upload a file of your choice, marmalade-tutorial.art image recommended.

![pinataUploadFile](/assets/docs/178035687-65fec618-1163-420e-958b-9a85a56a49c3.png)

And once done, your file is pinned on the decentralized IPFS!

1. Finally, take note of the CID from the uploaded picture and save the link
   with the format `https://gateway.pinata.cloud/ipfs/{YourPicture’sCID}`
2. We’re now one step closer to minting the Token on-chain! Next, If you have a
   private public key pair, we’ll go straight to creating and minting the token.
   If not follow
   [this guide](/docs/kadena/wallets/chainweaver#keys-accounts-and-ownership) to
   make the private/public keychain and account.

### Nothing as Cold as a Mint

### Creating a data manifest

The token manifest is the data we want to bind to the token. In this case we
would want to bind the lookup URL to the image we uploaded to the IPFS in part
one, and maybe some other data like the token’s name and description too!

a. Create the URI and datum

**Uri**: The contract that we are calling for manifest creation is called
kip.token-manifest. However, in the code snippets below, we replaced it with a
contractAddress placeholder.

To use the already created kip.token-manifest contract, all you have to do is
replace contractAddress with it.

```typescript title=" "
const createUri = async (scheme:Object, data:Object):Promise<Uri> => {

const res = await Pact.fetch.local(
  {
    pactCode: `(${contractAddress}.uri (read-string 'scheme) (read-string 'data))`,
    //pact-lang-api function to construct transaction meta data
    envData: {scheme, data},
// These are some values you can put into the make meta function
// Respectively, they parameters passed into mkMeta are the sender, chain ID, gas price, gas limit, creation time, and time ttl
    meta: Pact.lang.mkMeta(‘some-sender’,’1’,0.000001,100000, Math.round(new Date().getTime() / 1000) - 15, 28800),
  },
`https://${node}/chainweb/0.0/${networkId}/chain/${chainId}/pact`
);
const all:Uri = res.result.data;
return(all);
```

The scheme parameter is usually filled with the encoding/type of the URI data
and the data parameter is the data itself. URIs are usually used to store
on-chain data, but since our image is getting stored off-chain (in IPFS!) we can
freely choose what we fill in here.

:::info title="Additional Code Explanation"

The createUri function calls `Pact.fetch.local`, which is a function that calls
a specified non-signing/read-only contract call to the blockchain. Information
on the function can be found [here](https://github.com/kadena-io/pact-lang-api).

In this case it is calling the .uri contract function which simply parses the
parameters into a suitable URI object. :::

**Datum**: A datum is simply a singular piece of information. This information
could be anything we want to embed with the token (ex. Something about
versioning). In this case, with an image, we would want to add the IPFS URL, a
title, a description, and some other details. An example datum for
marmalade-tutorial.art Token would
be:`{ “Name”: “marmalade-tutorial.art”, “Description” : “Marmalade tutorial token”, “imageUrl” : “https://gateway.pinata.cloud/ipfs/QmR8ZWmRj8Rh5kCRwcRr6AaiPTf8AjWeGxVJ6KjGjhwqPQ” }`

```typescript title=" "
const createDatum = async (uri:Uri, datum:any):Promise<Datum>=> {
  //calling get-all() function from smart contract
    const res = await Pact.fetch.local(
      {
        pactCode: `(${contractAddress}.create-datum (read-msg 'uri) (read-msg 'datum))`,
        //pact-lang-api function to construct transaction meta data
        envData: {uri, datum},
        meta: Pact.lang.mkMeta(‘some-sender’,’1’,0.000001,100000, Math.round(new Date().getTime() / 1000) - 15, 28800),
      },
`https://${node}/chainweb/0.0/${networkId}/chain/${chainId}/pact`
    );
    const all = res.result.data;
    return(all);
};
```

b. Create manifest: This is the final part to creating the manifest. Simply pass
your URI and datum array (you can add as much datum as you want) into the
manifest.

```typescript title=" "
const createManifest = async (uri:Uri, data:Array<Datum>):Promise<TypeWrapper> => {
  //calling get-all() function from smart contract
    const res = await Pact.fetch.local(
      {
	//contractAddress = address of your manifest contract
        pactCode: `(${contractAddress}.create-manifest (read-msg 'uri) (read-msg 'data))`,
        //pact-lang-api function to construct transaction meta data
        envData: {uri, data},
        meta:Pact.lang.mkMeta(‘some-sender’,’1’,0.000001,100000, Math.round(new Date().getTime() / 1000) - 15, 28800),
      },
`https://${node}/chainweb/0.0/${networkId}/chain/${chainId}/pact`
    );
    const all = res.result.data;
    return(all);
};
```

This manifest is simply used to store data about the token. Calling this
function adds the hash onto the URI and datum. If this data is ever changed, the
hash would be different, so it gives us a way to identify the original.

### Create Token

To create a token, you only need the precision, the token name (id), the private
key of the creator, the policy, and the parameters to pass into the policy. The
policy is the most important part of the token because it dictates factors such
as royalties and how to buy/sell.

```typescript title=" "
export const createToken = async (
    precision,
    id,
    accountPrivKey,
    policy, //We used the fixed quote policy, but you can pass in whatever policy you use
    policyParams
  ) => {
      const accountPubKey =  Pact.crypto.restoreKeyPairFromSecretKey(accountPrivKey).publicKey
      const create = await Pact.fetch.send(
        {
          pactCode: `(${hftAPI.contractAddress}.create-token "${id}" ${precision} (read-msg 'manifest) ${policy.api.contractAddress})`,
          networkId: 'testnet04',
          keyPairs: [{
            //EXCHANGE ACCOUNT KEYS
            //PLEASE KEEP SAFE
            publicKey: accountPubKey, //Signing PubK
            secretKey: accountPrivKey,//signing secret key
            clist: [
              //capability to transfer crosschain
               //capability for gas
              {
                name: `coin.GAS`,
                args: []
              }
            ]
          }],
          meta: Pact.lang.mkMeta('marmalade.tester', '1' , 0.000001, 100000, Math.round(new Date().getTime() / 1000) - 15, 28800), 28800),
          envData: policyParams,
        },
        `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`
      )
      const reqKey = create
      console.log(reqKey)
    }
```

### Mint Token

The mint function allows the NFT creator (or someone else) to mint the token
that they just created. All it needs is the token name, amount to mint, the
receiver’s account, the receiver’s keyset, and the signer’s private key.

```ts
export const mintToken = async (
  tokenId, // Token name
  amount,
  receiverAccount,
  receiverKeyset,
  signerAccountPrivKey,
) => {
  const newKs =
    typeof receiverKeyset === 'object'
      ? receiverKeyset
      : JSON.parse(receiverKeyset);
  const accountPubKey =
    Pact.crypto.restoreKeyPairFromSecretKey(signerAccountPrivKey).publicKey;
  const mint = await Pact.fetch.send(
    {
      pactCode: `(${hftAPI.contractAddress}.mint "${tokenId}" "${receiverAccount}" (read-keyset 'ks) (read-decimal 'amount))`,
      networkId: 'testnet04',
      keyPairs: [
        {
          // EXCHANGE ACCOUNT KEYS
          //  PLEASE KEEP SAFE
          publicKey: accountPubKey, //Signing PubK
          secretKey: signerAccountPrivKey, //signing secret key
          clist: [
            //capability to transfer crosschain
            //capability for gas
            {
              name: `coin.GAS`,
              args: [],
            },
            {
              name: `${hftAPI.contractAddress}.MINT`,
              args: [tokenId, receiverAccount, Number.parseFloat(amount)],
            },
          ],
        },
      ],
      //pact-lang-api function to construct transaction metadata
      meta: Pact.lang.mkMeta(
        'marmalade.tester',
        '1',
        0.000001,
        100000,
        creationTime(),
        28800,
      ),
      envData: {
        ks: newKs,
        amount,
      },
    },
    `https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact`,
  );
  const reqKey = mint;
  console.log(reqKey);
};
```

Congratulations, you have learned the inner workings of Marmalade and know how
to mint an NFT. Now get out there and have fun building!
