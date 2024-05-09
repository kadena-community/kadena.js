---
title: Kadena Public Blockchain. Getting Started with Transfers
description:
  Kadena began enabling Kadena (KDA) token transfers on December 17. The network
  has experienced some serious growth as we’ve transitioned from testnet to
  mainnet, with over 1,000,000 blocks mined by more than 10,000 GPUs (at an
  average hash rate between 10–15 TH/second) on mainnet. We’ve been heavily
  relying on the community to help establish best miner practices in the
  network.
menu: Kadena Public Blockchain. Getting Started with Transfers
label: Kadena Public Blockchain. Getting Started with Transfers
publishDate: 2019-12-19
headerImage: /assets/blog/2019/0_N20Oo9xivfuJFuug.webp
tags: [pact]
author: Emily Pillmore
authorId: emily.pillmore
layout: blog
---

# Kadena Public Blockchain: Getting Started with Transfers

Kadena began enabling Kadena (KDA) token transfers on December 17. The network
has experienced some serious growth as we’ve transitioned from testnet to
mainnet, with over
[1,000,000 blocks mined](https://explorer.chainweb.com/mainnet) by more than
10,000 GPUs (at an average hash rate between 10–15 TH/second) on mainnet. We’ve
been heavily relying on the community to help establish best miner practices in
the network.

Now, tokens earned by miners are transferrable to and from other accounts
(peer-to-peer). Because transfers are such an integral part of any blockchain
ecosystem, we’ve decided to publish this post as an introduction to the Pact
smart contract system. We’d like to illustrate the myriad ways to transfer
tokens and highlight some of the technologies available to users to do so. We’ll
break down this tutorial into three steps of varying levels of sophistication:
using Pact to create a smart contract, the standalone transfer portal, and
transferring with the Chainweaver Wallet.

Hopefully, this will get you excited to begin your journey with Kadena. Let’s
get started!

### The Kadena Coin Contract

Kadena’s coin contract was made available as a
[transaction at genesis](https://explorer.chainweb.com/mainnet/chain/0/height/0),
which means the token is a contract in the same way that any other contract
exists in the blockchain (though, it is somewhat special with the way each
Chainweb node interoperates with it natively). While we don’t yet have a module
explorer for people to browse module code (coming soon when smart contracts are
turned on), you can browse
[the source](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v2/coin.pact)
and the
[Kadena Improvement Process (KIP-0002) RFC](https://github.com/kadena-io/KIPs/blob/kip-0002-proposal/kip-0002.md)
for the fungible asset token (KDA) on which it’s based to get a feel for both
the Pact language and the fundamental operations available in the contract. Most
notable among these are the specifications for how to transfer KDA to and from
accounts on the blockchain. We’ll go through the accounts and the types of
transfers available to you in the next few sections, and then move on to a
tutorial for how to actually put transfers into practice along with some of the
available tools.

### How are Kadena Accounts Structured?

We’ve written up a
[Beginner’s Guide to Accounts](/blogchain/2020/beginners-guide-to-kadena-accounts-keysets-2020-01-14)
in the Kadena blockchain, but let’s do a whirlwind tour here just to refresh.
The Kadena blockchain is unique in the sense that each chain is a separate
blockchain for which a global consensus is maintained, and there is no global
notion of “account” or “address.” On each chain, however, there is a keyset
registry that makes sure that no keyset gets duplicated. This means that the
final decider for what uniquely identifies a user of the blockchain is their
keyset on a given chain
([read here for more on keysets](/build/pact/advanced#keysets-and-authorizationh960403648)).
If you choose to have your keyset only exist on chain 0, that’s your prerogative
and perfectly fine. However, users may find it simplifies things if they define
their keyset on all chains to avoid confusion, even though there’s a
cryptographically nil chance that anyone else might have the same keys on a
different chain.

Every smart contract has the ability to maintain its own ledger (a key-value
store) that defines the data structures it works with. In the case of the coin
contract, every entry into the coin contract ledger is specified by an account
name (any LATIN-1 string between 3 and 256 characters) as a key, with a value of
both a decimal balance and a keyset that governs the account. Account names can
be anything as long as they conform to that spec. You could be `"emily"`,
`"stone cold steve"`, or simply the public key associated with your keyset as an
account name. Many users find the latter to be the easiest to remember. Since
the chance of overlap is negligible, it helps them remember which keys they’re
supposed to use for that particular account. I support this, as the two accounts
`"emily"` and `"Emily"` are distinct and it can be easy to forget which is
yours. We call accounts that are not simply the public key string “vanity
accounts” (like vanity license plates), to distinguish naming conventions.

So, to summarize,

```shell
    key: Account name -> value: { Balance, Keys }
```

It’s that simple! Now, let’s talk about the types of transfers available with
this token.

### Types of Available Transfers

I’ve shown you how to construct a simple coin transfer, but now let’s talk about
the types of transfers available to you, the user. The coin contract has 3 in
total to address varying use-cases:

- `coin.transfer`: This function is for transfers between two existing accounts
  on the same chain, for some decimal number of tokens. This is the one I
  showcased above, and is the most basic of the transfers. It works exactly as
  you might imagine.

- `coin.transfer-create`: In the case where the recipient of the transfer
  perhaps does not exist, `transfer-create` is how you would transfer coins
  safely to the receiving account. If the recipient already exists, then
  `coin.transfer-create` works exactly as `coin.transfer` would with a single
  exception. You must know the
  [keyset](https://pactlang.org/beginner/pact-keysets/) of the account you’re
  transferring to and provide it as a parameter to the function. When the
  receiving account exists, the keyset you’ve passed along is checked against
  the keyset on file for the account to make sure they’re the same for executing
  the transfer as expected. When the account _does not exist_, however, an
  account will be constructed using the recipient account and keyset with the
  balance transferred from the sender account. In general, this function is
  safer than `coin.transfer`, but that safety comes at the cost of convenience.
  I recommend using this one whenever possible.

- `coin.transfer-crosschain`: This function is especially interesting in that it
  is the only way to transfer tokens from one chain to another, and is a more
  involved process that requires you to learn about
  [`defpact` continuations](/reference/syntax#defcaph-1335639635) in Pact.
  I plan to cover this in a separate tutorial, where I have the opportunity to
  explain both `defpact` and Simple Payment Verification (SPV) in Pact and how
  cool it is (sorry Thanos!). In the meantime, just know that there is a way of
  transporting tokens across blockchains natively, available in Kadena (and
  Pact).

## Smart Contracts with Pact

[Pact](https://www.kadena.io/pact) is the smart contract language running at the
heart of the Kadena public blockchain. We’ve produced a
[bunch of tutorials](https://pactlang.org/) on every aspect of the Pact language
ecosystem, but we’ll review a few here to illustrate our use-case. This will be
done with Pact 3.3, the currently available version of Pact.

### Creating an API request

Smart contracts are written in Pact. To actually get them into a block on the
blockchain, they need to be sent to a blockchain node. This is done by
formatting an [API request](/reference/rest-api) and sending the request to
the appropriate endpoint. Pact has this functionality built into the language in
the form of the `pact -a` family of commands. To make use of `pact -a`, one must
create an API request template that takes the form of a YAML script pointing at
(or containing) Pact code, which is then converted into the appropriate JSON
representation. A user may then submit this JSON in a cURL request (or e.g., a
Postman request) to the blockchain for processing.

For example, if I wanted to transfer 1.0 KDA from my vanity account, `emily` to
`nick-cage` because I’m such a huge fan, I would construct a YAML template
request like the following (note: using a burner keypair generated by `pact -g`
for demonstrative purposes):

![Nick Cage boutta be stoked](/assets/blog/2019/0_SMQl0hcXoW7HIFRn.webp)

This looks complicated. Unfortunately, it is, which is why we automate this all
in the wallet. All you have to do is toggle the knobs with whatever is
appropriate. However, it’s still good to know about what settings you’re able to
toggle to achieve an optimal transaction specification. The anatomy of this
request can be broken down as follows:

- (**code|codeFile**): This field is either the raw code you wish to execute or
  a reference to a `.pact` file containing the smart contract you wish to
  execute.

- **publicMeta**: This field contains all of the blockchain-specific metadata
  needed to interact with the Kadena public blockchain. It speaks for itself. A
  user must specify how much gas they’re willing to pay and at what price, where
  they’re sending it, who the sender is, etc. The creation time and TTL define
  what period of time your transaction can be submitted to the blockchain. The
  creation time is the time that your transaction can first be submitted
  (specified as the number of seconds since 1970 — i.e. since POSIX epoch) and
  the TTL (time to live) is how many seconds it will be valid for before being
  removed from the mempool. In practice, you can also go to
  [duckduckgo.com](http://duckduckgo.com/) and search for ‘unix epoch’ to get
  the current time, but I’ll usually just go into Node.js and run the following:

```shell
  Math.round((new Date).getTime()/1000)-15;
```

- **networkId**: This field describes the ID of the receiving network. Since
  Pact is blockchain-agnostic, this may be Tendermint, or Polkadot, or any of
  the myriad blockchains supported or to be supported in the future. Currently,
  the network ID for the main Kadena network is `mainnet01`, but through this
  tutorial, I’ll be running on `testnet04` to make sure no actual transactions
  go into the main blockchain.

- **keyPairs:** The public/private fields are self-explanatory — you have to
  sign the transaction somehow. The less obvious field is for capabilities
  allowed in the transaction. Capabilities are an integral part of the Pact
  security model. If a particular smart contract supports capabilities, then
  you’re allowed to say exactly what operations you (the signer) allow for use
  of your keys. In the case of the Kadena coin contract, we’re allowing my
  keypair to be used for gas payments, as well as a transfer of a specific
  amount. These operations can be automated and brought into scope by contract
  control flow, but the coin contract requires your feedback for safety reasons.

- **type**: This will only ever be `exec` for one-off scripts, or `cont` for
  escrow continuations. In our case, we’re executing a one-off transaction.

For a more complete specification of the available options, consult the
[Pact API Request Formatter documentation](/reference/rest-api#api-request-formatterh-1762879533)
and the tutorials on [pact-lang.org](https://pact-lang.org). Here’s a template
that can be copied and pasted for your requests:

```yaml
code:
data:
networkId:
publicMeta:
  chainId:
  sender:
  gasLimit:
  gasPrice:
  ttl:
  creationTime:
keyPairs:
  - public:
    secret:
    caps:
type: exec
```

And here’s the one I used that you can cargo cult for yourself and change all of
the bracketed fields:

```yaml
code: |-
  (coin.transfer <from> <to> 1.0)
publicMeta:
  chainId: '0'
  sender: <from>
  gasLimit: 600
  gasPrice: 0.0000001
  ttl: 600
  creationTime: <regenerate this>
networkId: 'mainnet01'
keyPairs:
  - public: <public>
    secret: <secret>
    caps:
      - name: 'coin.TRANSFER'
        args: [<from>, <to>, 1.0]
      - name: 'coin.GAS'
        args: []
type: exec
```

Once I have this YAML file all figured out, I generate the following JSON
request using `pact -a` and passing in the YAML file as a parameter:

![Nick Cage waits impatiently…](/assets/blog/2019/0_vAXxFno45PhS68NR.webp)

Now, I have a JSON object that I can post to the /send endpoint of the Pact
Service API for the Kadena blockchain. In practice, this will be a POST request
with the formatted JSON object on a node endpoint which takes the following
form:
`https://<host>:<port>/chainweb/0.0/<network-id>/chain/<chain id>/pact/api/v1/send`.
Here is an example cURL request that I’m using:

```bash
    curl --location --request POST '[https://us2.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/send'](https://us2.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/send') \
    --header 'Content-Type: application/json' \
    --data-raw '{"cmds":[{"hash":"F7jzCyUgwcBUWYVe3xEFw66X45NHgheNrqm8LL9gMIU","sigs":[{"sig":"c0024309593b8b28b356c5edfed957c1dd7e163eecc446a327fa8d4db76faccc111b11786fe9cc6fc200ceab137d53f4df46ab76aa7f268be183289f282db20e"}],"cmd":"{\"networkId\":\"testnet04\",\"payload\":{\"exec\":{\"data\":null,\"code\":\"(coin.transfer\\n  \\\"emily\\\"\\n  \\\"nick-cage\\\"\\n  1.0)\"}},\"signers\":[{\"pubKey\":\"368059ab25bec92f19a4f8ce172030e5d672e4879aaae8d5be8b705dd3dfae7f\",\"clist\":[{\"args\":[\"emily\",\"nick-cage\",1],\"name\":\"coin.TRANSFER\"}]}],\"meta\":{\"creationTime\":1576691834,\"ttl\":600,\"gasLimit\":100000,\"chainId\":\"0\",\"gasPrice\":1.0e-7,\"sender\":\"emily\"},\"nonce\":\"2019-12-18 17:58:40.212918 UTC\"}"}]}'
```

When the blockchain has accepted your request, you’ll get a request key back —
the unique key associated with your request as it’s processing.

![Nick Cage is on the edge of his seat](/assets/blog/2019/0_r-_QKJ7NrIUQF1w3.webp)

To see the outputs of your transaction, POST that request key JSON object to the
`/poll` or `/listen` endpoints. When the transaction has been mined and exists
in some block, you’ll get a response back. Note that it may take a few block
heights (i.e. 30–90 seconds) to see your transaction, and you will not receive
outputs during that time. Here’s an example of a `/poll` cURL request and the
response:

```bash
    curl --location --request POST '[https://us2.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/poll'](https://us2.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/poll') \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "requestKeys": [
            "BYHjcdTqqMTROLasn82ka-DpYhE9Q1K3nFxt5vcXxGQ"
        ]
    }'
```

![Nick Cage just got paid!](/assets/blog/2019/0_HrFtsdIQXHeLhNAG.webp)

Success!

We realize that this is a low-level technically intensive process, but like
every API on the web, there exist tools that automate this experience and
provide varying levels of sophisticated UI to help make the process seamless.
We’ll get into these tools below, but first, let’s talk about dry-running
transactions to make sure that they succeed.

### Using /Local to Dry-Run Transactions

The Kadena blockchain follows the example that Ethereum set by charging the gas
limit specified in a transaction in the case that the transaction fails. This
takes place for a few very important reasons:

- It incentivizes users to only submit transactions they know will succeed, or
  get penalized. This closes a serious DOS vector for node operators.

- Miners are compensated for computational costs of failing transactions, which
  may fail for a variety of nondeterministic reasons, such as database datasets
  exploding in size to the point that transactions can’t cover them.

- To a lesser extent, it incentivizes automation and “safe” modes of
  transaction, such as wallet or script use that contribute toward a robust
  ecosystem.

On its own, this would be a rather punishing system. After all, it is inevitable
that new users will be unfamiliar with how to transact with the blockchain. And
even more so inevitable that people make mistakes when transacting. To provide
as much information as possible, every Kadena node has a dedicated endpoint
called `/local` on which a user can dry-run their transactions and discover the
costs and outputs of a given transaction.

As mentioned above, `pact -a` is a family of commands. The command that
generates a valid local request is `pact -l -a`, and can be used with any
existing request YAML to produce a JSON object compatible with the `/local`
endpoint of any node. Chain ID does not matter in this case — the endpoint will
accept any valid command — but it’s good to provide accurate information to
produce valid feedback for the dry run. As above, we’ll reuse the existing
transfer request from `"emily"` to `"nick-cage"`:

![](/assets/blog/2019/0_SMQl0hcXoW7HIFRn.webp)

Now, let’s submit this to `pact -l -a`. This will generate the following JSON
object:

![Nick Cage is getting locally stoked](/assets/blog/2019/0_mylOMmYXfs9jOjvb.webp)

Then, let’s send this to the `/local` endpoint. This time, rather than receiving
a request key, we receive the outputs directly along with some additional
metadata not included with the outputs of a `/send` transaction:

![](/assets/blog/2019/0_Wx-n9lu36ul8oDMD.webp)

The outputs display the results, the logs, a request key, all of the metadata
used in the transaction, along with the most up-to-date block time, parent block
hash, and block height on that chain. Not only do you know if your transaction
will succeed, but you’ll have all the context you need to figure out why it
failed. Let’s see what failure looks like in this mode by using a user that does
not exist as the recipient of our transfer:

![Lol he is definitely not Nick Cage](/assets/blog/2019/0_C6aplWmRVjI50cHX.webp)

Our recipient, “Lol I am definitely not Nick Cage,” does not exist in the
blockchain, and so I’ve received confirmation that my transaction failed. This
information is sent along with the callstack, type of error, specific failure
message, and wherein the coin contract the code that called it failed.

## Tools for Transfers

As mentioned above, there are a few tools available to you that automate the
construction of API requests (and transfers in particular). They are available
in a few different forms.

### Community Transfer Scripts

There is a
[standalone community transfer](https://github.com/kadena-community/kadena-transfer-js)
script which automates the construction of transfers by providing web fields
which fill in the necessary information for your API request and call our
[Pact Lang Javascript API](https://github.com/kadena-io/pact-lang-api) which
sends the transactions for you:

![](/assets/blog/2019/0_DaUrf1kHUqfs64B4.webp)

You can either set this up in your browser by using the `index.html` provided,
or you can run it as a standalone script with node as described in the
`README.md` of the project. If you read the first section thoroughly, it should
all be very familiar, and you can picture how the YAML is being created and sent
via this information. However, you’ll see that there’s a lack of gas and
TTL/creationTime. That is because we’ve chosen some sensible defaults that
should make the process even easier. This script will run a `coin.transfer` or
`coin.transfer-create` depending on the parameters you supply. Pool operators
and power miners such as BigShoots
[have set this up on their nodes](https://bigshoots.net/kadena/kadena-transfer/)
as a courtesy to other users (thanks BigShoots).

### Chainweaver Wallet

If you’re on Mac or Linux, you can make use of Kadena’s in-house Smart Wallet
offering: the [Chainweaver Wallet](https://www.kadena.io/chainweaver).

The Chainweaver Wallet features a full Pact IDE (including a REPL) for authoring
smart contracts and interacting with existing smart contracts on the Kadena
blockchain in addition to its account servicing features. I recommend you run
the wallet from the perspective of a smart contract writer (and, for
transparency, a Kadena employee).

![Chainweaver Accounts](/assets/blog/2019/1_InzUGFWZa3qVMCGz0vk50g.webp)

![Beautiful isn’t it? This is the Pact IDE embedded in the wallet](/assets/blog/2019/1_qhD0Y3potANXrt29pt4GJA.webp)

Chainweaver has a great UI for sending and receiving tokens using a novel
address format for Chainweaver users that we are calling a Kadena Address. In
the Wallets tab, locate your Chainweaver account and simply click the “send”
tab, which will take you into a small popup window in which you can paste the
Kadena Address of the receiving account. Depending on the context, Chainweaver
can detect whether a particular receiving account exists and on what chain, and
will choose whether to use `coin.transfer`, `coin.transfer-create`, or
`coin.transfer-crosschain` depending on that context. It will even automate the
previously manual step of constructing an SPV proof in the case of a cross-chain
transfer. We’ve written up a
[thorough tutorial ](/blogchain/2020/do-anything-on-the-kadena-blockchain-with-a-single-tool-2020-02-21)to
help you understand all of the snazzy features available in Chainweaver.

### Additional Wallet Options

We welcome any wallet additions as community projects and will be happy to help
set you up with a dedicated repository in our
[Kadena Community GitHub](https://github.com/kadena-community) organization if
you have a submission. There is one already, courtesy of our Kadena’s Colin
Woodbury (@fosskers). He wrote a fantastic CLI wallet aptly named
[Bag of Holding,](https://github.com/kadena-community/bag-of-holding) which you
can operate from your terminal:

![](/assets/blog/2019/0_dcHxj1YuPBHz9rh9.webp)

Bag of Holding works essentially as a nice UI around the creation and execution
of API requests as described earlier in this article. It’s solid, simple,
reliable, and (I think) looks great.

## Conclusion

There you have it: an introduction to Pact transactions by way of transfers. Our
tooling is in the very early stages. We welcome help from the community for
documenting these tools and constructing new ones along the way. We are always
happy to rep community-blessed tools if they are better than our own. We welcome
anyone to contribute to the
[Kadena Community projects repository](https://github.com/kadena-community) with
your own project or add to existing ones. So far, the community projects have
yielded both a great terminal wallet with
[Bag of Holding](https://github.com/kadena-community/bag-of-holding), and a
[blazing fast GPU miner](https://github.com/kadena-community/bigolchungus)
courtesy of Alex Khonovalov, Edmund Noble and myriad other insanely smart
community members.

Thanks to everyone who contributed, and please feel free to raise your questions
to me in [Discord](https://discord.io/kadena) — my handle is one of @topos,
@pitopos, or @emilypi depending on where I am on the internet. I’m perpetually
glued to my screen, so I’ll usually answer if you find me. In the event I’m
sleeping, there may be a delay.

## Glossary

- **Keyset:** Refers to the
  [Pact Keyset](/build/pact/advanced#keysets-and-authorizationh960403648)
  authorization scheme. These are a set of public keys in addition to a
  predicate function (e.g. `keys-all`, `keys-any` etc.) that decides the
  authorization policy for the keys in the keyset. For example, if I have a set
  of keys with the `keys-all` predicate, then all keys must be present as
  signers in a transaction to do anything with the keyset.

- **Account:** An entry in the Kadena coin contract ledger (a key-value store).
  This consists of a string of 3 to 256 LATIN-1 characters as a key, pointing at
  a value consisting of a decimal balance and a keyset governing the account.

- **Vanity Account:** We call accounts “vanity” accounts when they have a custom
  vanity name that is not just the public key string associated with a keyset.
  Think of it like a vanity license plate.

- **Token (KDA):** When we refer to “the” token, we refer to the definition and
  implementation of the Kadena fungible asset specification, called
  `fungible-v1` and `coin`, respectively. In practice, this just means
  [the coin contract](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v2/coin.pact)!

- **Smart Contract:**
  [Pact modules](/build/pact/advanced#module-declarationh676938214) define
  smart contracts.

- **API Request:** An HTTP request sent to one of the
  [endpoints](/build/pact/advanced#queries-and-local-executionh-453550016)
  available on any Kadena Blockchain Node.

- **Transaction:** An API Request sent to the `/send` or `/local` endpoints of a
  node, which executes Pact code. Sending an API request to the `/send` endpoint
  results in a transaction that gets included in a block, while a request to
  `/local` will not.

- **Capability:** This refers to the
  [capability permissions system](/build/pact/advanced#guards-vs-capabilitiesh100483783)
  baked into the Pact language. More on this to come.

- **Dry-run:** A transaction sent to the `/local` endpoint.

- **Gas: **How many units of compute (i.e. tokens) it takes to run a transaction

- **Gas Limit: **How much gas is available for the transaction, specified by the
  user.

- **Gas Price:** The price of gas that the user is willing to pay. This is a
  decimal multiplier for the gas limit, which results in the final gas supply
  available for a transaction. The result is measured against how much gas it
  takes to run a transaction to determine the miner reward, and any refunds the
  user might receive (i.e. total gas supply minus total gas used).

- **Chain Id:** The identifier for a given chain in the Kadena blockchain.
  (Currently, they are 0 through 9).

- **Creation Time:** Time in seconds since POSIX epoch (i.e. since
  01/01/1970:00:00:00) that marks the earliest time that a transaction should be
  considered a candidate to be included in a block.

- **TTL:** Time-to-Live — the expiration date in seconds for how long a
  transaction should be considered for candidacy in a block after its creation
  time. TTLs can be at most 48 hours after the initial creation.

- **Network Id:** The unique identifier for the network (e.g. `testnet04` or
  `mainnet01`)

- **KeyPair:** A public/private keypair.

- **Public Metadata:** The non-transactional data of a Transaction used to
  interact with the blockchain (i.e. what chain ID, TTL, creationTime, who the
  sender is, etc.)

- **Blockchain Node:** A
  [Kadena node](https://github.com/kadena-io/chainweb-node)

- **Wallet:** A device, physical medium, program or service which stores the
  public and/or private keys. It can be used to track ownership, receive, or
  spend cryptocurrencies.

- **Kadena Address:** The unique, secure format in which the Chainweaver Wallet
  stores accounts.

- **IDE:** Integrated development environment

- **REPL:**
  [Read-eval-print-loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop).
  Many languages have this as a means of getting fast feedback and running code.
