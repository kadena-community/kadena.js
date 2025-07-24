# Kadena Devnet Sandbox Action

This GitHub Action sets up a Kadena Devnet environment using Docker Compose with the hackachain indexer components. It replaces the previous approach that used the all-in-one `kadena/devnet` container.

## Overview

This action:

1. Sets up a Chainweb node (blockchain node)
2. Configures a simulation miner
3. Sets up the hackachain indexer components:
   - PostgreSQL database
   - GraphQL API (replacement for @kadena/graphql)
   - Indexer service (replacement for chainweb-data)
4. Configures a proxy server to maintain the same interface as the original kadena/devnet container

## Usage

```yaml
- name: Setup Kadena sandbox
  uses: ./.github/actions/sandbox
```

The action has a simple interface that matches the original sandbox action, but internally it uses the docker-compose.yaml file that sets up the separate services instead of the kadena/devnet container.

## Exposed Ports

The proxy server exposes the same ports as the original kadena/devnet container:

| Port | Description | Service |
|------|-------------|---------|
| 8080 | Public HTTP API | Proxy to various services |
| 4000 | Graph service port | Proxy to indexer-kadenagraphql:3000 |
| 1790 | On-Demand Mining API | Placeholder |
| 1791 | Mining Trigger API | Placeholder |
| 1848 | Chainweb node's service port | Direct access to chainweb-node |
| 1789 | Chainweb node's p2p API port | Direct access to chainweb-node |
| 1849 | Chainweb data API port | Proxy to indexer:3001 |
| 5432 | PostgreSQL | Direct access to postgres |
| 9999 | Process Compose management API | Placeholder |

## Exposed Services

| Service | Port | Description |
|---------|------|-------------|
| Chainweb Node | 1848 | Node Service API |
| Chainweb Node | 1789 | P2P API |
| Simulation Miner | 1917 | Stratum mining protocol |
| PostgreSQL | 5432 | Database |
| GraphQL API | 3000 | GraphQL endpoint (replacement for @kadena/graphql) |
| Indexer | 3001 | Main indexer service |

## Environment Variables

The action sets up the necessary environment variables automatically, but you can override them by setting them in your workflow:

```yaml
env:
  DB_USERNAME: postgres
  DB_PASSWORD: your_password
  DB_NAME: your_db_name
  MINER_PUBLIC_KEY: your_miner_public_key
  MINER_PRIVATE_KEY: your_miner_private_key
```

## Migration from kadena/devnet Container

This action replaces the all-in-one `kadena/devnet` container with separate services in a Docker Compose setup. The key differences are:

1. **GraphQL Endpoint**: 
   - Old: Accessed via port 8080 in the kadena/devnet container
   - New: Accessed via port 3000 from the indexer-kadenagraphql service

2. **Indexer**:
   - Old: Used chainweb-data as the ETL
   - New: Uses the hackachain indexer components

3. **Database**:
   - Old: Embedded in the kadena/devnet container
   - New: Separate PostgreSQL service

## Healthcheck

The action includes a healthcheck script that verifies the Chainweb node, GraphQL endpoint, and proxy server are functioning correctly. The action will fail if any service is not healthy after multiple attempts.

## Environment Variables

If you need to customize the environment, you can modify the docker-compose.yaml file directly or set environment variables before running the action:

```yaml
- name: Set environment variables
  run: |
    echo "CHAINWEB_NODE_IMAGE=ghcr.io/kadena-io/chainweb-node:your-tag" >> $GITHUB_ENV
    echo "DB_USERNAME=your-username" >> $GITHUB_ENV
    echo "DB_PASSWORD=your-password" >> $GITHUB_ENV
    echo "DB_NAME=your-db-name" >> $GITHUB_ENV

- name: Setup Kadena sandbox
  uses: ./.github/actions/sandbox
```

## Migration from kadena/devnet Container

This action replaces the all-in-one `kadena/devnet` container with separate services in a Docker Compose setup, but maintains the same interface through a proxy server. This means that applications that were using the original kadena/devnet container can continue to use the same ports and endpoints without modification.

### Key Components

1. **Chainweb Node**: The blockchain node that processes transactions and maintains the blockchain state.
2. **Simulation Miner**: Simulates mining activity to produce blocks.
3. **Hackachain Indexer**: Replaces the chainweb-data ETL and provides a GraphQL API.
4. **Proxy Server**: Exposes the same ports and endpoints as the original kadena/devnet container.

### Architecture

```
                   +----------------+
                   |  Proxy Server  |
                   +----------------+
                           |
                           v
+----------------+  +----------------+  +----------------+
| Chainweb Node  |  | GraphQL API    |  | Indexer        |
+----------------+  +----------------+  +----------------+
                           |
                           v
                   +----------------+
                   |   PostgreSQL   |
                   +----------------+
```