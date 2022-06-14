<p align="center">
  <img src="assets/logo/kadenajs.png" width="200" alt="kadena.js" />
</p>

# kadena.js - Kadena Javascript API

> Kadena.js is a collection of libraries that will allow you to interact with the `local`, `development`, `testnet` or `mainnet` Kadena chainweb.
> It will provide helper function

### Running Tests
To run the unit tests:
```shell
$ npm test
```

To run integration tests against a pact server:
```shell
// Requires starting a pact server that is listening at http://127.0.0.1:9001.
$ npm start:pact
$ npm test:pact-server
```

To run integration tests against devnet:
```shell
// Requires starting devnet and exposing the pact endpoints at http://localhost:8080.
// For more details, see instructions at https://github.com/kadena-io/devnet.
$ npm test:devnet
```

### TODO
* Add coverage tooling
* coverage Charts
* size warning
