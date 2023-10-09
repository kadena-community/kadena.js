---
title: Running Tests
description: Kadena makes blockchain work for everyone.
menu: KadenaJS
label: Running Tests
order: 6
editLink: https://github.com/kadena-community/kadena.js/edit/main/packages/libs/kadena.js/README.md
layout: full
tags: [run tests,pact server]
lastModifiedDate: Thu, 06 Jul 2023 12:02:09 GMT
---
# Running Tests

### Unit testing

To run the unit tests:

```sh
$ npm test
```

To run single unit tests:

```sh
$ npm test --single=[nameOfFile] where [nameOfFile] can be a regex
```

### integration tests

#### Pactserver

To run integration tests against a pact server the following command can be
used:

```sh
$ npm test:integration:pactserver
```

#### devnet

To run integration tests against devnet it requires starting devnet and exposing
the pact endpoints at [http://localhost:8080 ](http://localhost:8080). For more details, see
instructions at the [Devnet Github repository ](https://github.com/kadena-io/devnet).

The following command can be used:

```sh
$ npm test:integration:devnet
```

> **TODO** make Pact server port configurable
