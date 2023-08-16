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

> **NOTE** you need Docker (or an alternative, e.g.
> [podman](https://podman.io/docs/installation)) to be installed

1. Start devnet:

   ```bash
   # start devnet
   docker run -it -p 8080:8080 -p 5432:5432 -v $HOME/.devnet/l1:/devnet/.devenv enof/devnet:l2-latest
   ```

   > **Windows alternative**  
   > replace `$HOME` with `%HomeDrive%%HomePath%`  
   > if you get an error try not mounting the volume by removing the part
   > `-v <arg>`

2. Fund your account

   ```bash
   docker run --rm -it -v $(pwd):/app/ --add-host=devnet:host-gateway enof/devnet:l2-latest --task=fund
   ```

   > **Windows alternative**  
   > replace `$(pwd)` with `%cd%`

3. Open [localhost:8080](localhost:8080), and click "DB Access", and modify the
   `devnet` users' password

   ```
   ALTER USER devnet WITH PASSWORD 'devnet';
   ```

4. Add env var to `.env`

   ```
   DATABASE_URL="postgresql:///devnet?host=/$HOME/.devnet/l1/state/postgres/.s.PGSQL.5432"
   DATABASE_URL="postgresql://devnet:devnet@localhost:5432"
   USE_EMBEDDED_POSTGRES=false
   ```

5. Start the project
   ```
   rushx start
   ```
