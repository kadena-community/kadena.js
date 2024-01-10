## Table of Contents

- [Table of Contents][1]
- [Usage & Purpose][2]
- [Concepts][3]
- [Pre-requisites][4]
- [Assumptions][5]
- [The Process][6]
- [Aditional Notes][7]

## Usage & Purpose

The devnet does not come with the marmalade smart contracts deployed out of the
box. Therefore, to be able to use marmalade, we need to deploy all the smart
contracts in the devnet. The goal of this folder is to deploy the Marmalade
scripts into the devnet. It contains all the necessary scripts and configuration
files to facilitate this process.

To deploy marmalade in devnet, please run

```sh
pnpm deploy:marmalade -c <chains>
```

The chains format is comma-separated list, so if you want it do be deployed in
chain 1 and 2, the command would look like `pnpm deploy:marmalade -c 1,2`

## Concepts

To better understand the deployment of marmalade, here are some key concepts to
be aware of:

- Templates: these are `.yaml` files that contain the necessary data for the
  deployment of a smart contract.
- Code files: these are `.pact` files that contain PACT code. These are normally
  referenced in the template files Both templates and code files can contain
  replaceable tags, in the following format: `{{arguments}}`.

## Pre-requisites

- Fill in the environment variables that need to be set before starting the
  deployment scripts. You can find more about these in `.env.example`
- Optional: make sure that all the configurations under
  `packages/apps/graph/src/devnet/marmalade/config` are correct and check if all
  default values set in
  `packages/apps/graph/src/devnet/marmalade/config/arguments.ts` are right.
  These arguments are going to be used to replace the tags in the templates and
  code files (referred to in [concepts](#concepts) )

## Assumptions

- The template files should be numbered. They will be deployed in alphabetical
  order so please make sure that the files are named accordingly (eg.
  `0.fungible-util.yaml`)
- Subfolders are allowed
- When supplying the remote template folder path on the `.env`, the following
  folder structure should be followed (in the remote directory):

```bash
.                               # supplied folder
├── namespace1                  # namespace (will be used when creating transaction)
│   ├── 0.template1.yaml        # order number + filename / folder name
│   ├── 1.template2.yaml        # order number + filename / folder name
│   └── 2.template3.yaml        # order number + filename / folder name
│   ├── 3.policies              # order number + filename / folder name
│   │   ├── template4.yaml      # order number + filename / folder name
│   │   └── template5.yaml      # order number + filename / folder name
├── namespace2                  # namespace (will be used when creating transaction)
│   ├── 0.template4.yaml        # order number + filename / folder name
│   ├── 1.template5.yaml        # order number + filename / folder name
│   └── 2.template6.yaml        # order number + filename / folder name
└── ...
```

## The Process

This is a small step-by-step description of the steps that are taken to deploy
marmalade in the devnet

1. Downloading the necessary templates and code files from a given repository
2. Reading all the template files and creating transactions from them. In this
   step, all the arguments must be supplied
3. Deploying all the necessary namespaces
4. Deploying all the necessary templates (that will be responsible for creating
   interfaces, tables, etc)

### Aditional Notes

These scripts use Github's API to retrieve the files. If a token is not provided
on the `.env` file, the requests will be unauthenticated which results in a
significantly lower rate limit. It is strongly advised that a token is provided.
For more information, please click
[here](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api?apiVersion=2022-11-28)

[1]: #table-of-contents
[2]: #usage--purpose
[3]: #concepts
[4]: #pre-requisites
[5]: #assumptions
[6]: #the-process
[7]: #aditional-notes
