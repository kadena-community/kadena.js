<!-- genericHeader start -->

# @kadena/create-kadena-app

CLI tool to create a starter project with @kadena/client integration

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Create Kadena App

The create-kadena-app CLI tool enables you to quickly start a new application
that has Kadena Blockchain integration set up and ready to go. The application
supports Typescript and makes use of `@kadena/client` and `@kadena/pactjs-cli`.

The application is backed by a [**smart contract**][1] written in Pact that is
included for convenience and also deployed on the Kadena Blockchain, so you have
a working application from the start.

The two most common blockchain use cases are covered in this starter app:

- Reading a message from the chain (requires no transaction).
- Writing a message on the chain, which includes signing and sending a
  transaction on chain and waiting for it to be mined.
- `@kadena/wallet-adapter-core` for flexible wallet integration

[Wallet Adapter Core][2] is used for signing transactions, enabling support for multiple Kadena wallets (Chainweaver, Ecko, Zelcore, etc.) and more adapters are continually being added.

## Supported Templates

Create Kadena App supports a number of well known and widely used frameworks to
choose from when starting a new project. The following project templates are
currently available:

- [Nextjs][3]
- [Vuejs][4]
- [Angular][5]

## Usage

The recommended way of using Create Kadena App is through npx.

```sh
npx @kadena/create-kadena-app
```

Create Kadena app allows you to pass command line arguments to set up a new
project non-interactively. While we might further expand functionality in the
future currently there's one command available, `generate-project`. See
create-kadena-app generate --help:

```sh
Usage: create-kadena-app generate-project [options]

Generate starter project

Options:
  -n, --name <value>      Project name
  -t, --template <value>  Project template to use
  -h, --help              display help for command
```

### Options:

- `name` determines the name of the project but also the folder on the
  filesystem that will contain the project. The same general operating system
  folder name rules apply and are being validated.
- `template` determines the template being used for the project that is being
  created. Valid values are:
  - nextjs
  - vuejs
  - angular
- `help` displays the help menu

## The Pact smart contract

The smart contract is called `cka-message-store` and can be found [here][6]. The
folder contains two files `message-store.pact` which is the smart contract
written in Pact but also `message-store.repl` which contains a supporting test
suite. The contract is also deployed on testnet chain 0 as
`free.cka-message-store`.

The two main functions of the contract are `read-message` and `write-message`
which are shown below:

```pact
(defun read-message (account:string)
  "Read a message for a specific account"

  (with-default-read messages account
    { "message": "You haven't written any message yet" }
    { "message" := message }
    message
  )
)
```

Reading a message is unrestricted, so everyone can access the smart contract and
read the message a user has written, given the account is provided.

```pact
(defun write-message (account:string message:string)
  "Write a message"

  (enforce (<= (length message) 150) "Message can be a maximum of 150 characters long")

  ;; Try to acquire the `ACCOUNT-OWNER` capability which checks
  ;; that the transaction owner is also the owner of the KDA account provided as parameter to our `write-messages` function.
  (with-capability (ACCOUNT-OWNER account)
    (write messages account { "message" : message })
  )
)
```

Writing a message is guarded by a capability `ACCOUNT-OWNER`, so only the
account owner kan write a message.

The contract contains a single table `messages` that stores the messages for all
users.

This readme doesn't aim to be a tutorial for Pact therefore we aren't going into
the complete details of the contract nor the Pact language. For more detailed
info on Pact development visit the **Build** section on [docs.kadena.io][7].

[1]: ##The-Pact-smart-contract
[2]: https://github.com/kadena-community/kadena.js/tree/main/packages/libs/wallet-adapter-core
[3]: https://nextjs.org/
[4]: https://vuejs.org/
[5]: https://angular.io/
[6]:
  https://github.com/kadena-community/kadena.js/tree/main/packages/tools/create-kadena-app/pact
[7]: https://docs.kadena.io/
