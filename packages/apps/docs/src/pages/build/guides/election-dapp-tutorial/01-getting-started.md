---
title: "01: Getting started"
description: "In the first chapter of the Election dApp tutorial you will download the code of the project, explore the project structure and run the frontend."
menu: Election dApp tutorial
label: "01: Getting started"
order: 1
layout: full
tags: [pact, smart contract, typescript, tutorial]
---

# Chapter 01: Getting started

In this chapter, you will download the starter code for the election website
in its initial state. You will first explore the project structure. Then, you
will install the dependencies of the front-end application and run it. The
front-end will run without a connection to any blockchain. All data is stored
in memory for now. In the following chapters, you will gradually integrate
this front-end application with the blockchain. At the start of every next
chapter, you will find the name of the branch containing the solution of the
previous chapter. This will allow you to complete the entire tutorial even if
you get stuck in a particular chapter.

## Get the code

```bash
git clone git@github.com:kadena-community/election-dapp.git
cd election-dapp
git checkout 01-getting-started
```

If you want to take a peek at the completed code for this tutorial, check out
the following branch.

```bash
git checkout 00-complete
```

## Visual Studio Code

The most convenient way to work with the Election dApp project and its files is
to load the project into your [Visual Studio Code](https://code.visualstudio.com/)
workspace. Kadena has developed a "PACT" extension for this editor. It features
syntax highlighting, error reporting and code coverage reporting to improve your
smart contract development workflow. The extension does require you to have `pact`
and `pact-lsp` installed on your computer. You can configure the path to each
executable in the plugin settings. If you are using another editor, you may also
profit from just `pact-lsp` which provides the syntax highlighting. The links
to the installation instructions are listed on the
[main page](/build/guides/election-dapp-tutorial) of this tutorial.

## Project structure

At the root of the project you will see three folders: `frontend`, `pact` and
`snippets`. Each of these folders contain a set of files for a specific purpose.
Let's explore these folders one by one.

### Pact

This is where the `.pact` files for your smart contracts go, as well as `.repl`
files that will be used to test your smart contracts in isolation. You will
notice a `./root` folder that already contains some `.pact` files. They contain
Pact modules that the smart contracts you will create in later chapters depend
on. They only need to be there for local testing with `.repl` files. You do not
need to deploy them to the blockchain alongside your own `.pact` files, because
they are already deployed on Devnet, Testnet and Mainnet by default. So, once
your Pact module is deployed on the blockchain it will be able to load these
dependencies from the blockchain.

### Front-end

For the front-end of the election website, a basic React app was created. You
could use any other framework to create the front-end, because the connection
with the blockchain is established through the
[Kadena Client](https://www.npmjs.com/package/@kadena/client) npm package
that can be imported in any JavaScript project. At the end of the line, this
package simply makes HTTP API requests to the blockchain.
Inside of the React components, data is manipulated by calling service methods
the services get a specific implementation of repositories injected, depending
on the projects configuration. Initially, the project is configured to use
the in-memory implementation of repositories. The in-memory repositories
simply perform all data operations on JavaScript arrays and objects defined
in the same file. This implementation was created for you to have a simple
representation of the data flow as a reference while you are building the
blockchain implementation. Also, you can try out the app before you start
building, so you will have some contextual information about what you are
going to work on. Instructions for running the front-end with the in-memory
repository implementation will be provided later in this chapter.

### Snippets

In this folder you will find several JavaScript snippets that use the Kadena
Client library to perform actions against the blockchain that are not directly
related to the functionality of the election dApp per se, like deploy and
upgrading smart contracts, creating and funding accounts, and more. You will
learn more about these snippets in the following chapters.

## Run the front-end

Run the following commands in your terminal, assuming that you have cloned
the repository, changed the directory to the project root and switched
to the `01-getting-started` branch.

```bash
cd ./frontend
npm install
npm run start
```

Open a browser window and visit `http://localhost:3000`. You will see the working
front-end of the election website. Because all data is manipulated in memory,
you can freely click around and submit data. The state of the front-end will be
reset as soon as you refresh the page. The website shows a list of candidates
and the number of votes they have received. There is an option to set your
account name. This can be anything at this point of the tutorial. After you have
set an account name, you can cast a vote on any of the candidates. You can only
cast one vote per account. It is also possible to add a candidate or candidates
in bulk. This operation is not yet limited to certain accounts with a specific
permission, but we will get to that soon enough.

*[Screenshot of the front-end]*

## Next steps

At this point you should have a working development environment and an understanding
of the project structure. You have installed and run the front-end of the election
website, and you have an understanding of its features. In the next chapter of this
tutorial you will run a blockchain on your own computer using Docker. After that,
you will be ready to start developing smart contracts and creating the Devnet
implementations of the front-end repositories.
