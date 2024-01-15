---
title: "Prepare your workspace"
description: "Get started with the Election workshop by downloading project code and exploring the directories and application frontend."
menu: "Workshop: Election application"
label: "Prepare your workspace"
order: 1
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Prepare your workspace

To get started with the Election workshop, you first need to prepare a working environment with some starter code for the election application website you''ll be building.
In this tutorial, you'll complete the following tasks:

- Clone the project repository.
- Explore the initial state of the project structure. 
- Install the dependencies for the application frontend.
- Explore the functionality of the frontend as a standalone application with data stored in memory.

## Before you begin

Before you start this tutorial, verify the following basic requirements:

- You have an internet connection and a web browser installed on your local computer.
- You have a code editor, such as [Visual Studio Code](https://code.visualstudio.com/download), access to an interactive terminal shell, and are generally familiar with using command-line programs.
- You have [Git](https://git-scm.com/downloads) installed and are generally familiar with using `git` commands.
- You have [Node.js](https://nodejs.dev/en/learn/how-to-install-nodejs/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed on your local computer.
- You have [Pact](https://github.com/kadena-io/pact#installing-pact) or the [Pact language server plugin](https://github.com/kadena-io/pact-lsp/releases) installed on your local computer to support syntax highlighting and other features in the code editor.

## Clone the project repository

The first step in setting up your working environment for the Election workshop is to copy the project repository you'll be working with.

To clone the Election project repository:

1. Open a terminal shell on your computer.

1. Clone the project repository by running the following command:

   ```bash
   git clone git@github.com:kadena-community/voting-dapp.git election-dapp
   ```

1. Change to the root of the project directory by running the following command:
   
   ```bash
   cd election-dapp
   ```

1. Switch to the branch that contains the starter code for the workshop by running the following command:
   
   ```bash
   git checkout 01-getting-started
   ```

## Open the project in a code editor

In most cases, you'll want to work with the Election project files using an integrated development environment (IDE) such as [Visual Studio Code](https://code.visualstudio.com/). 
If you use Visual Studio Code, you can also use the Kadena Pact language server extension to enable syntax highlighting, error reporting, and code coverage details to improve your smart contract development workflow. 
To use the Visual Studio Code extension, you must have `pact` and `pact-lsp` installed on your local computer. 
You can configure the path to each executable in the Pact extension settings. 
If you use a different code editor, you might also benefit from having the `pact-lsp` executable installed to provide syntax highlighting for Pact code. 

To use the Pact extension in Visual Studio Code:

1. Download and install [Pact](https://github.com/kadena-io/pact#installing-pact).
   
   For example, you can install Pact on macOS using Homebrew:

   ```bash
   brew install kadena-io/pact/pact
   ```

2. Download and install the [Pact Language Server plugin](https://github.com/kadena-io/pact-lsp/releases).

3. Open the `election-dapp` folder in Visual Studio Code.

4. In the Visual Studio Code editor, select **View**, then click **Extensions**.

5. Type Pact to search for the extension, select **Pact** from the search results, then click **Install**.
   
   You can also install the Pact Snippets extension.
   The Pact Snippets extension provides a collection of code templates for common operations.

   After you install the extensions you want to use in your code editor, close the extensions.

1. Click the **Explorer** view and notice that the `election-dapp` contains the following folders: 
   
   - The `frontend` folder contains the files for the election application website.
     In this tutorial, the website consists of React components, but you could use any framework to create the frontend.
     The frontend of the application connects to the blockchain through the [Kadena client](https://www.npmjs.com/package/@kadena/client).
     The Kadena client is an `npm` package that can be imported into any JavaScript project and acts as a conduit for making HTTP API requests to the blockchain. 
     You'll get a closer look at the frontend components in [Explore the frontend application](#explore-the-frontend-application).

   - The `pact` folder contains your smart contract `.pact` files  and the `.repl` files that are used to test your smart contracts before you deploy them. You'll see that the `pact/root` folder already contains some `.pact` files. 
      These files are Pact modules that the smart contracts you create in later tutorials depend on. 
      These modules are for local testing with `.repl` files. 
      You don't need to deploy them because they are deployed on Kadena networks by default.

   - The `snippets` folder contains scripts that use the Kadena client library to perform actions against the blockchain that aren't directly related to the functionality of the election application. 
      For example, files in the `snippets` folder support deploying and upgrading smart contracts, creating and funding accounts, and transferring funds between accounts. 
      You'll learn more about the scripts in the `snippets` folder in later tutorials.

## Explore the frontend application

Initially, the election application website uses React components that are not connected to a blockchain backend. 
Inside of the React components, data is manipulated by calling service methods.
The services methods get a specific implementation of repositories injected depending on the project configuration.
At this point, the project is configured to use an **in-memory** implementation of the repositories.
The project performs all data operations using JavaScript arrays and objects that are defined in an in-memory backend file. 

The in-memory implementation allows you to explore the basic data flow as a frame of reference before you start building the blockchain implementation. 
By exploring the application before you start building, you'll have some context to help you understand the work you're about to do.

To explore the election application website frontend:

1. Open a terminal shell on your computer.

2. Verify that you are in the `election-dapp` directory and have checked out the 01-getting-started branch by running the following commands:
   
   ``` bash
   pwd
   git branch
   ```

3. Change to the `frontend` directory by running the following command:

   ```bash
   cd ./frontend
   ```

1. Install frontend dependencies by running the following command:

   ```bash
   npm install
   ```

1. Start the application locally by running the following command:

    ```bash
   npm run start
   ```
 
2. Open a browser and navigate to the URL `http://localhost:5173`.

   The website displays a list of candidates and the number of votes each candidate has received. 
   If you have a Kadena account, you can set an account name and cast a vote on any of the candidates. 
   The application only allows you to cast one vote per account.
   
   If you have a Kadena account, you can also add candidates. 
   There are no specific permissions required to perform any operation at this point.

   Because all data is manipulated in memory, the state of the frontend is reset as soon as you refresh the page.
 
## Next steps

At this point, you have a basic development environment and an overview of the project directory structure. 
You have also had you're first look at the frontend for the election website and explored its main features. 

In the next tutorial, you'll start a development network—**devnet**—on your local computer inside of a Docker container. 
The development network is a local blockchain similar to the Kadena test network where you can experiment with different features in an isolated environment.
After you get the development network running, you'll be ready to start developing smart contracts to connect the election application to the blockchain backend.
