# Integration Tests

In order to ensure integration with Kadena's blockchain, the client comes with
integration tests that can be run towards an instance of devnet.

## Pre-requisites

Make sure all dependencies have been installed and you've successfully built the
project. For the integration tests you'll also need [docker][1].

```sh
pnpm install
pnpm run build
```

## Unit Tests

Kadena Client uses the default code coverage profile, found [here][2].

## Integration Tests (with devnet)

To run integration tests against devnet it requires starting devnet and exposing
the pact endpoints at [http://localhost:8080][3]. To do this, simply execute the
following command: Always pulling will ensure you're always using the latest
available version of devnet.

```sh
docker run --pull=always -it --rm -p 127.0.0.1:8080:8080 -v l1:/data kadena/devnet
```

This will start up devnet and expose the required ports.

Once devnet is up and running execute the following script to execute the
integration tests.

```sh
pnpm run test:integration
```

[1]: https://www.docker.com/
[2]: /packages/tools/heft-rig/jest.config.json
[3]: http://localhost:8080
