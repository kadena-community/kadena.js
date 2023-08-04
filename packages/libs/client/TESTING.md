 # Testing

@Kadena/Client has unit tests to validate client behaviour and integration tests to validate integration with Kadena's blockchain. This document describes how to execute both of these locally.

## Pre-requisites
Make sure all dependencies have been installed and you've successfully built the project. For the unit integration tests you'll also need [docker](https://www.docker.com/). 

Install dependencies:
````shell
 rush install
````
Build the project:
````shell
 rush build
````


## Unit Tests
Kadena Client uses the default code coverage profile, found [here][1]. 

Change directory to the client. (assuming you're in the repository root)
``` shell
cd packages/libs/client
```

``` shell
rushx test
```

## Integration Tests (with devnet)
To run integration tests against devnet it requires starting devnet and exposing
the pact endpoints at [http://localhost:8080][2]. To do this, simply execute the following command:

``` shell
docker run -it -p 8080:1337 -v $HOME/.devnet/l1:/root/.devenv enof/devnet
```
This will start up devnet and expose the required ports. 

Once devnet is up and running execute the following script to execute the integration tests.

``` shell
rushx test:integration
```

[1]: /packages/tools/heft-rig/profiles/default/config/jest.config.json
[2]: http://localhost:8080

