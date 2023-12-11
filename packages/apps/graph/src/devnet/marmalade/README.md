# Marmalade in Devnet

The goal of this folder is to deploy Marmalade scripts into the Devnet. It
contains all the necessary scripts and configuration files to facilitate this
process.

## Concepts

In order to better understand the deployment of marmalade, here are some key
concepts to be aware of:

- Templates: these are `.yaml` files that contain the necessary data for the
  deployment of a smart contract.
- Code files: these are `.pact` files that contain PACT code. These are normally
  referenced in the template files Both templates and code files can contain
  replacable tags, in the following format: `{{arguments}}`.

## Pre-requisites

- Fill in the environment variables that need to be set before starting the
  deployment scripts. You can find more about these in `.env.example`
- Please make sure that all the configurations under
  `packages/apps/graph/src/devnet/marmalade/config` are correct and please set
  the arguments in
  `packages/apps/graph/src/devnet/marmalade/config/arguments.ts`. These
  arguments are going to be used to replace the tags in the templates and code
  files (refered to in [concepts](#concepts) )

## The process

This is a small step-by-step description of the steps that are taked to deploy
marmalade in the devnet

1. Downloading the necessary templates and codefiles from a given repository
2. Reading all the templates files and creating transactions from them. In this
   step it is important that all the arguments are supplied
3. Deploying all the necessary namespaces
4. Deploying all the necessary templates (that will be responsible to create
   interfaces, tables, etc)

## Assumptions
