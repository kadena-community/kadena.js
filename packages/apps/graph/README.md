<!-- genericHeader start -->

# @kadena/graph

GraphQL project, available for running your own GraphQL endpoint. This project
uses chainweb-data as datasource

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Kadena GraphQL

A GraphQL endpoint that interacts with chainweb-data.

# Getting started

```sh
rush install -t @kadena/graph
rush build -t @kadena/graph
```

Prerequisites:

- docker


1. Start devnet:
     ```bash
     # start devnet
     docker run -it -p 8080:8080 -p 5432:5432 -v $HOME/.devnet/l1:/devnet/.devenv enof/devnet:l2-latest
     ```

    > **Windows alternative**
    > replace `$HOME` with  `%HomeDrive%%HomePath%`

2. Fund your account
    ```bash
    docker run --rm -it -v $(pwd):/app/ --add-host=devnet:host-gateway enof/kda-cli --task=fund
    ```

    > **Windows alternative**
    > replace `$(pwd)` with  `%cd%`

3. Add env var to `.env`
    ```
    DATABASE_URL="postgresql://albert@localhost:5432/chainweb-data"
    USE_EMBEDDED_POSTGRES=false
    ```

4. Start the project
    ```
    rushx start
    ```
