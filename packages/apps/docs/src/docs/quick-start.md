---
title: "Quick start"
id: quickstart
description: "Learn how to set up a development environment and write a simple smart contract for the Kadena network."
menu: Build
label: "Quick start"
order: 1
layout: full
tags: [pact, typescript, account, transactions, utils]
---

# Quick start for Kadena developers

Welcome to the Kadena development _Quick start_ guide. 
Follow these simplified instructions to set up your development environment with a local blockchain and developer tools, then write your first contract using the Pact smart contract programming language.

## Before you begin

Before you begin, verify your computer meets the following basic requirements and has the following tools installed:

* Access to the internet, an interactive terminal shell, and a web browser.

* [Git](https://git-scm.com/downloads) version control program. 
  You can verify that `git` is installed by running `git --version` on your computer.

* [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/), version 18 or higher.
  You can verify that `node.js` is installed by running `node --version` on your computer.

* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), the command-line interface for the node package manager.
    You can verify that `npm` is installed by running `npm --version` on your computer.

* [Docker](https://docs.docker.com/get-started/get-docker/), version x or higher.
  You can verify that `docker` is installed by running `docker --version` on your computer.

If you have everything you need, you can set up your development environment and create your first contract with a few basic steps.

## Install Pact

The Pact smart contract programming language is specifically designed for writing [smart contracts](/resources/glossary) to run safely and efficiently on the Kadena blockchain network. 
Follow the appropriate instructions for your operating system to Pact.

- [Install Pact on Linux]()
- [Install Pact on macOS]()
- [Install Pact on Microcost Windows Services for Linux (WSL)]()

For more information about installing Pact, see [Install Pact]().

## Set up a local network

The Kadena development network allows you to run a standalone local blockchain node to simulate network operations and to test your smart contracts locally before deploying to a test or production network.

To set up the local network, open a terminal shell on your computer then run the following commands to get the development network Docker image and start the network in a Docker container:

```bash
{`git clone https://github.com/kadena-io/devnet
cd devnet
npm install
docker run --rm --interactive --tty --publish 8080:8080 --volume kadena_devnet:/data --name devnet kadena/devnet`}
```

For more information about starting the Kadena development network in a Docker container, see [Set up the local network](/build/dev-network).

## Install the Kadena command-line interface

The Kadena command-line interface (`kadena-cli`) provides direct access to the Kadena blockchain and commands to create, test, deploy, and manage applications for the Kadena network. 
You can use the Kadena command-line interface interactively or in scripts and automated workflows.

To install and configure the `kadena-cli` program, open a terminal shell on your computer then run the following commands:

<CodeBlock language="bash">
{`npm install --global kadena-cli
kadena config init`}
</CodeBlock>

This command creates the `.kadena` configuration folder location is your current working directory and adds default network settings to a `networks` subfolder, then prompts you to create a wallet.
Wallets are an important part of interacting with any blockchain, so you can create one now as part of your initial configuration steps.
Follow the prompts displayed to continue setting up your local development environment with a development wallet and an account.

For more information about getting started with `kadena-cli` commands, see [Develop using the Kadena CLI](/build/dev-with-cli).
For command-line reference information, see [Kadena CLI](/reference/kadena-cli).

## Write your first smart contract

You can now write and execute a simple `greeting` smart contract using the Pact smart contract programming language and the Pact interactive interpreter.

1. Open a terminal shell on your computer.
3. Start the Pact interpreter you installed in the first step by running the following command:

   ```bash
   pact
   ```

2. Copy and paste the following simple `greeting` module code, then press return:

   <CodeBlock language="pact">
   (namespace 'free)
   (module greeting GOVERNANCE
     (defcap GOVERNANCE () true)
     (defun say-hello(name:string)
       (format "Hello, {}! ~ from Kadena" [name])
     )
   )
   </CodeBlock>
   
   You should see the module loaded with output similar to the following:

   <CodeBlock language="pact">
   "Loaded module greeting, hash f1yyXqj5HstOni1QdZmuagUJXbu72VmYiwXua7Vp4-0"
   </CodeBlock>

1. Call the `say-hello` function with a string similar to the following:

   <CodeBlock language="pact">
   (say-hello "Pistolas")
   </CodeBlock>

   The function returns a greeting similar to the following:

   <CodeBlock language="pact">
   "Hello, Pistolas! ~ from Kadena"
   </CodeBlock>

   You can exit the Pact interpreter by pressing control-d on the keyboard.

## Next steps

Congratulations! 
In this _Quick start_, you learned the basics of how to set up a development environment with the Pact programming language, a local development network, and the Kadena developer command-line interface.
You also got a first look at how to write and execute a simple Pact contract in the interactive interpreter.
You can learn more about these topics in the [Build](/build) documentation for developers. 
Here are some suggested next steps:

- Start learning the Pact programming language with [Get started with Pact](/build/pact/get-started-with-pact).
- Explore hands-on coding projects in [Coding projects](/coding-projects/coding-projects).
- Learn how to interact with the blockchain and deployed contracts using [Kadena API](/api) calls and [call templates](/guides/craft-api-call).
- Join the [Kadena Discord community](https://discord.gg/kadena) for support and discussions.


