---
title: "Start a local blockchain"
description: "Start the development network blockchain on your local computer and explore the smart contracts available by default."
menu: "Workshop: Election application"
label: "Start a local blockchain"
order: 2
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Start a local blockchain

In this workshop, you are going to implement the back-end of the election website using  **smart contracts** on the Kadena blockchain.
The smart contract you'll be writing for the election application defines rules for:

- Nominating candidates.
- Casting and counting votes.
- Storing the nominated candidates and the votes for each candidate.

Before you publish any smart contract on a public network, like the Kadena test network or the Kadena main network, you should always test that the contract works as expected on your local computer.
In this tutorial, you'll set up a local development network—`devnet`—to run a blockchain inside of a Docker container on your local computer.
You can use this development network to test your smart contracts and experiment with code in an isolated environment that your can reset to a clean state at any time.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have cloned the [election-dapp](https://github.com/kadena-community/voting-dapp.git election-dapp) as described in [Prepare your workspace](/build/guides/election-dapp-tutorial/prepare-your-workspace) and have checkd out the `01-getting-started` branch.
- You have [Docker](https://docs.docker.com/get-docker/) installed and are generally familiar with using Docker commands for containerized applications.

## Run the development network in Docker

The Kadena development network—called `devnet`—is a fully functional Kadena blockchain network that runs inside of a Docker application container.
For this tutorial, you'll want to start the blockchain with a clean slate every time you stop and restart the container.
Because you don't need to maintain the state of the local blockchain between restarts, you can start the container without creating a persistent volume.

To start the local development network:

1. Open a terminal shell on your computer.

2. Start the Docker service if it isn't configured to start automatically in your local environment.

   You can run the `docker info` command to check whether Docker is currently running.

3. Start the `devnet` container without a persistent volume by running the following command:

   ```shell
   docker run --interactive --tty --publish 8080:8080 kadena/devnet:latest
   ```

   You can stop the network at any time—and reset the blockchain state—by pressing Ctrl-c in the terminal. starting it again with the command above.

   If you encounter an error where the version of Chainweb is invalid after a certain date (mostly after a service date) run the following command to pull the latest version

   ```shell
   docker run --pull=always --interactive --tty --publish 8080:8080 kadena/devnet:latest
   ```

   If you can't run the Pact executable on your local computer, you can mount the `./pact` folder of the project in the container by running the following command:

   ```bash
   docker run --interactive --tty \
    --publish 8080:8080 \
    --volume ./pact:/pact-cli:ro \
    kadena/devnet:latest
   ```

   If you mount the `pact` folder, you can execute `pact` commands using an interactive `pact>` shell in your browser at [http://localhost:8080/ttyd/pact-cli/](http://localhost:8080/ttyd/pact-cli/).

   After you start the development network, you'll see information about the network processes displayed in a terminal console.

   ![Development network (devnet) console](/assets/docs/election-workshop/devnet-console.png)

## Create a Chainweaver account

If you followed the [Quick start](/build/quickstart), you might already have a Chainweaver account.
Chainweaver is a desktop or web application that provides a graphical user interface for interacting with Kadena blockchain networks, accounts, and smart contracts.
For example, you can use Chainweaver in the election workshop tutorials to debug your smart contracts and your local development blockchain.

If you don't already have a Chainweaver account, you should create one using either the [Chainweaver desktop application](https://github.com/kadena-io/chainweaver/releases) or the [Chainweaver web application](https://chainweaver.kadena.network/).
After you download and install the desktop application or open Chainweaver in a browser, you can create accounts to interact with Kadena networks.

To create a Chainweaver account:

1. Open Chainweaver.

1. Review the Terms of Service and confirm that you agree to them, then click **Create a new wallet**.

2. Type and confirm the password you want to use for this account, then click **Continue**.

1. Confirm that you understand the importance of the recovery phrase, then click **Continue**.

1. Click **Copy** to copy the 12-word recovery phrase to the clipboard so you can save it in a secure location, for example, as a note in a password vault.

   You can also reveal each word by moving the cursor over the text field in the browser. Write each word in the correct order and store the complete recovery phrase in a secure place.

1. Confirm that you have stored the recovery phrase, then click **Continue**.

2. Verify the 12-word recovery phrase by typing the correct words in the correct order, then click **Continue**.

1. Click **Done** to view your new wallet.

## Connect to the development network

Now that you have a Chainweaver wallet, you can connect it to the development network.

To add the development network to your new wallet:

1. Unlock Chainweaver.
2. Click **Settings** in the Chainweaver navigation panel.
3. Click **Network**.
4. Under Edit Networks, type the network name **devnet**, then click **Create**.
5. Expand the **devnet** network, then add the localhost as a node for this network by typing 127.0.0.1:8080.

   If the local computer is still running the development network Docker container, you should see the dot next to the node turn green.

1. Click **Ok** to close the network settings.

   After you click Ok, you can see **devnet** selected as your current network.
   All actions you perform in Chainweaver are now executed on the local development network.

## Explore default contracts

The development network has several smart contracts deployed by default.
You can use Chainweaver to view and interact with these default smart contracts.

To view the default smart contracts:

1. In Chainweaver, click **Contracts** in the navigation panel.

   After you click Contracts, Chainweaver displays two working areas:

   - The left side displays a sample contract in an editor that you can use to view and edit contract code and execute commands interactively.
   - The right side provides controls that enable you to navigate between contracts, view contract details, and test operations for contracts you have deployed.

1. On the right side of Contracts, click **Module Explorer** to view a list of contracts
that are already deployed on the local development network.

1. Under Deployed Contracts, change **All chains** to chain **0** to see the
list of unique contracts that are deployed to development network by default:

   - coin
   - fungible-v1
   - fungible-v2
   - fungible-xchain-v1
   - gas-payer-v1
   - ns

   These default contracts provide the basic functionality for the following common tasks:

   - Using tokens in the `coin` and `fungible` contracts.
   - Paying transaction fees in the `gas-payer` contract.
   - Organizing contracts into namespaces in the `ns` contract.

   These contracts are the same as the contracts in the `./pact/root` folder of your project.
   As you might remember from [Prepare your workspace](/build/guides/election-dapp-tutorial/prepare-your-workspace), the contracts exist in your project to enable local testing without connecting to the development network.

   You should also note that these default contracts aren't related to the election application. You'll be creating election-related content in contracts in later tutorials.

1. Click **View** for the `coin` contract to view its details.

   Explore the implemented interfaces, function calls, and capabilities listed for the contract.
   For example, under **Implemented interfaces**, view the `fungible-v2` interface and review the descriptions of the following functions:

   - transfer
   - transfer-create
   - details
   - create-account

   You'll interact with these functions and learn more about these features of smart contracts and in later tutorials.
   For now, it's enough to have a general idea of what's in a typical contract.

2. Click **Open** to load the source code for the `coin` contract into the left pane.

   Scroll through the source code and review the comments (`@doc`) to get a sense of how this contract works.

## Use TypeScript and Kadena client

Chainweaver is one way to interact with your smart contract code.
Another common way to interact with smart contracts is by using the Kadena client and TypeScript files.

To explore using TypeScript and Kadena client:

1. Open the `election-dapp` folder in your code editor and expand the `./snippets` folder.

2. Select the `package.json` file and review the list of scripts.

   For example:

   ```json
   "scripts": {
    "coin-details:devnet": "KADENA_NETWORK=devnet ts-node ./coin-details.ts",
    "create-account:devnet": "KADENA_NETWORK=devnet ts-node ./create-account.ts",
    "create-namespace:devnet": "KADENA_NETWORK=devnet ts-node ./principal-namespace.ts",
    "define-keyset:devnet": "KADENA_NETWORK=devnet ts-node ./define-keyset.ts",
    "deploy-gas-station:devnet": "KADENA_NETWORK=devnet ts-node ./deploy-gas-station.ts",
    "deploy-module:devnet": "KADENA_NETWORK=devnet ts-node ./deploy-module.ts",
    "format": "prettier --write .",
    "generate-types:coin:devnet": "pactjs contract-generate --contract coin --api http://localhost:8080/chainweb/0.0/development/chain/1/pact",
    "list-modules:devnet": "KADENA_NETWORK=devnet ts-node ./list-modules.ts",
    "transfer-create:devnet": "KADENA_NETWORK=devnet ts-node ./transfer-create.ts",
    "transfer:devnet": "KADENA_NETWORK=devnet ts-node ./transfer.ts"
   },
   ```

   These `npm` scripts call the corresponding TypeScript files in the `./snippets` folder.
   Before you execute any of these scripts, you need to:

   - Install package dependencies.
   - Check the configuration of the `KADENA_NETWORK` environment variable.

1. Open a terminal in the code editor, change to the `snippets` folder, then install the package dependencies by running the following commands:

   ```bash
   cd ./snippets
   npm install
   ```

2. Open the `configuration.ts` file in your code editor.

   Notice that when the environment variable `KADENA_NETWORK` is set to `devnet`, the functions exported from this file return the following:

   - The network identifier `development`.
   - The chain identifier `1`
   - The API base URL `localhost:8080`—the host and port for the node you previously specified for the development network—and appended with the network id and chain id.

   These configuration settings are loaded into the `list-modules.ts` file to configure the transaction that is sent to your local blockchain using the Kadena client.

1. Open the `list-modules.ts` file in your code editor.

   ```typescript
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

   Let's take a closer look at this code:

   - In the `main` function, the `Pact.builder` creates a transaction for executing the Pact code `(list-modules)`.
   - The `(list-modules)` function is a globally available function that isn't tied to a particular contract.
   - Because the `(list-modules)` function is a read-only operation, you can execute the transaction without paying any transaction fees using the `dirtyRead` method of the Kadena client.
   Internally, the `dirtyRead` method transforms the transaction object into a JSON object that is posted to an HTTP API endpoint of your development node.

   The rest of the `main` function processes the response from the API.

1. Execute the `(list-modules)` script by running the following command in a terminal window
with the current directory set to the `./snippets` folder:

   ```bash
   npm run list-modules:devnet
   ```

   The script output lists the modules deployed on your local development network.
   For example:

   ```bash
   > snippets@1.0.0 list-modules:devnet
   > KADENA_NETWORK=devnet ts-node ./list-modules.ts
   [
    'coin',
    'fungible-v1',
    'fungible-v2',
    'fungible-xchain-v1',
    'gas-payer-v1',
    'ns'
   ]
   ```

   This list is the same as the list displayed in the Chainweaver Module Explorer.
   You can use either Chainweaver or Kadena client to interact with the Kadena blockchain. These tools support both simple read operations and complex multi-step transactions.
   You'll learn more about using Chainweaver and Kadena client to test smart contracts in later tutorials as you develop functionality for the election back-end.

## Next steps

At this point, you have a functioning Kadena blockchain development network—`devnet`—running on your local computer.
In this tutorial, you learned:

-  How to start and stop a development network running on your local computer.
-  How to create a Chainweaver account and connect Chainweaver to the development network running on a local node.
-  How to explore the contracts that are deployed by default using Chainweaver.
-  How you can explore contracts using TypeScript files and the Kadena client.

In the next tutorial, you'll learn how you can use accounts and permissions to control who is allowed to perform different tasks on the development network.
In creating accounts, you'll learn about core concepts—including namespaces, keysets, and
modules—and how to use them to grant or restrict access to specific functions.
For example, you'll learn how to use an account, namespace, and keyset definition to control the permission to add candidates to the ballot in an election.
