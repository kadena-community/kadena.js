---
title: "02: Running Devnet"
description: "In the second chapter of the Election dApp tutorial you will use Docker to run a blockchain on your computer."
menu: Election dApp tutorial
label: "02: Running Devnet"
order: 2
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 02: Running Devnet

The back-end of the election website will be implemented with smart contracts
running on the Kadena blockchain. The smart contract contains rules for voting
and nominating candidates and stores the nominated candidates and the votes
for each candidate. Before publishing your smart contract on a public network,
like Testnet or Mainnet, it is good practice to test if it works as expected
on your local computer.

## Get the code

The project files have not been changed since the last chapter, so if you are
following along with the tutorial you can continue on the `01-getting-started`
branch. If you started the tutorial with this chapter, clone the tutorial
project and change the current directory of your terminal to the project folder.

```bash
git clone git@github.com:kadena-community/voting-dapp.git election-dapp
cd election-dapp
```

After cloning the project, switch branches to get the starter code for this chapter.

```bash
git checkout 02-running-devnet
```

## Run Devnet with Docker

Using Docker, you can spin up a fully functional
Kadena blockchain network called Devnet.

```bash
docker run -it -p 8080:8080 kadena/devnet:latest
```

In case you do not want or are unable to run the Pact executable on your local
computer, you can mount the `./pact` folder of the project to the container.

```bash
docker run -it -p 8080:8080 -v ./pact:/pact-cli:ro kadena/devnet:latest
```

This will enable you to execute `pact` commands against your `.pact` and `.repl`
files via aninteractive `pact>` shell in your browser at
[http://localhost:8080/ttyd/pact-cli/](http://localhost:8080/ttyd/pact-cli/).

In this tutorial you will not need to create a persistent volume to maintain
the state of your local blockchain between restarts of your Docker container.
In fact, you can conveniently start with a clean slate by stopping the container
with `Ctrl+c` and starting it again with the command above. If you do want to
use a persistent volume, start the container as follows. Whenever you want to
start from scratch, you will need to recreate the volume.

```bash
docker volume create kadena_devnet
docker run -it -p 8080:8080 -v kadena_devnet:/data -v ./pact:/pact-cli:ro --name devnet kadena/devnet
```

## Configure Devnet in Chainweaver

Throughout this tutorial, you will frequently use Chainweaver to debug your
locally running blockchain via Chainweaver's graphical user interface. Open
Chainweaver and create an account if you have not already. After unlocking
Chainweaver, navigate to `Settings` on the bottom left of the screen and
choose `Network`. Under `Edit networks` you will see Testnet and Mainnet
preconfigured. In the `Create new network` field type `Devnet` and click
`Create`. Devnet should appear in the list. Click the arrow button next to
Devnet to reveal a form where that allows you to add a node. You only need
to add one node: `localhost:8080`. If your Docker container is running, the
circle to the right of the node name turns green. Press `Ok` to confirm.
On the far left in the top bar of the Chainweaver window, you can now switch
your network to Devnet. This ensures that all actions that you perform in
Chainweaver will be executed against Devnet.

## Explore Devnet contracts

In Chainweaver, expand the left navigation bar and click contracts. Select
`Module Explorer` at the top of the right panel to reveal a list of contracts
that are already deployed on your Devnet. Next to the search box on top of
that list, change `All chains` to any particular chain to narrow down the
list to the unique contracts that are deployed to Devnet by default:

 * coin
 * fungible-v1
 * fungible-v2
 * fungible-xchain-v1
 * gas-payer-v1
 * ns

As the names of the contracts suggest, they provide the basic functionality
required for using tokens (coin, fungible), paying transaction fees (gas)
and organizing contracts in namespaces (ns). Notice the overlap with the
contracts in the `./pact/root` folder of your project. Do your remember
from [Chapter 01](/build/guides/election-dapp-tutorial/01-getting-started) why these
files need to exist in your project, even though the corresponding contracts
are already deployed on Mainnet, Testnet, as well as Devnet? Also note that
there are not contracts related to the election yet. You will be creating
those yourself in the course of this tutorial. Click the `View`
button in the row of the `coin` contract to view its details. At the top of
the right pane you can click `Open` to load the source code into the left pane.
You will use this functionality in later chapters to verify upgrades of your own
smart contracts. Scrolling down in the right pane you will encounter a list
of functions inside the contract that you can call directly from Chainweaver.
In this tutorial, however, you will mainly use the Kadena JavaScript client
to call smart contract functions. Scroll back up a bit to
`Implemented interfaces` and view the `fungible-v2` interface. Read the
documentation of the following functions:

 * transfer
 * transfer-create
 * get-balance
 * create-account

These are some of the first smart contract functions that you will interact
with in the upcoming chapters of this tutorial.

## List modules with Kadena Client

Open up your editor and navigate to the `./snippets` folder of the election
dApp project. In the `./snippets/package.json` file you will find a list of
npm scripts defined that call TypeScript files in the `./snippets` folder.
The first script you will execute is `list-modules:devnet`. As the name implies,
this script will list the modules deployed on Devnet. It does so by executing
the `./snippets/list-modules.ts` file. Before running the script,
let's install the dependencies of the snippets first and then take a closer
look at what happens in the `./snippets/list-modules.ts` file. Open a terminal
and execute the following commands from the root of the election dApp project.

```bash
cd ./snippets
npm install
```

Open the file `./snippets/configuration.ts`. When the environment variable
`KADENA_NETWORK` is set to `devnet`, the functions exported from this file
will return `fast-development` as the network id, `1` as the chain id and
and API base URL with the host and port of your local devnet and a path
composed of the aforementioned network id and chain id. This configuration
is loaded into the `./snippets/list-modules.ts` file to configure the
transaction that is sent to your local blockchain using the Kadena Client.

In the main function of this file, the `Pact.builder` is used to create a
transaction for executing the Pact code `(list-modules)`, which is a
globally available function, not tied to a particular deployed contract.
Calling this read operation does not cost any gas, so it can be executed
by passing the transaction to the `dirtyRead` method of the Kadena Client
instance. Internally, this method transforms the transaction object to a
json object that is posted to an HTTP API endpoint of your Devnet node.
The remainder of the main function deals with processing the response
from the API.

```typescript
// ./snippets/list-modules.ts
import { Pact, createClient } from '@kadena/client';
import { getApiHost, getChainId, getNetworkId } from './configuration';

const client = createClient(getApiHost());

main();

async function main() {
  const transaction = Pact.builder
    .execution('(list-modules)')
    .setMeta({ chainId: getChainId() })
    .setNetworkId(getNetworkId())
    .createTransaction();

  try {
    const response = await client.dirtyRead(transaction);

    const { result } = response;

    if (result.status === 'success') {
      console.log(result.data);
    } else {
      console.error(result.error);
    }
  } catch (e: unknown) {
    console.error((e as Error).message);
  }
}
```

Execute the snippet by running the following command in a terminal window
with the current directory set to the `./snippets` folder:

```bash
npm run list-modules:devnet
```

The script will produce the following output, a list of modules deployed on
your local Devnet:

```bash
[
  'coin',
  'fungible-v1',
  'fungible-v2',
  'fungible-xchain-v1',
  'gas-payer-v1',
  'ns'
]
```

Notice that the list is exactly the same as the list displayed in the module
explorer of Chainweaver. Both these tools can be used interchangably to interact
with the Kadena blockchain. They both support the execution of simple read
operations as well as the execution of complex multi-step transactions, as will
become clear when you will be using both approaches to test the smart contracts
that you will develop for the election website back-end in the remainder of this
tutorial.

## Next steps

At the end of this chapter you should have a full-fledged Kadena blockchain network
called Devnet running on your local computer. You have learned which contracts
are deployed on the Kadena networks by default and how you can explore them using
either Chainweaver or the Kadena JavaScript client. In the next chapter, you will
create an account on Devnet. This account will govern several aspects of the smart
contracts you will create in this tutorial: the namespace, keyset definition and
module. The account will also get exclusive permission to call certain functions in the
election smart contract, such as adding candidates. After setting up this account,
namespace and keyset definitions, all will be in place to deploy the smart contract
that will become the new back-end of the election website.
