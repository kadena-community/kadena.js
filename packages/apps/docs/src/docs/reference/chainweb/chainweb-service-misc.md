---
title: Maintenance and other services endpoints
description:
  Provides reference information for the endpoints you can use to query or update information about the chainweb-node configuration, backups, health check, and other services.
menu: Chainweb API
label: Maintenance endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Maintenance and other services endpoints

There are several endpoints you can use to query or update information about a Chainweb node, including its current configuration and availability.

## Start a backup job

Use `POST http://{baseURL}/make-backup` to start a backup job for a Chainweb node.
Starting a backup job creates a UNIX timestamp identifier for the job.
You can then use the identifier to check the status of the job to determine if the job is still in progress or the backup has been completed.

If a backup job is already in progress, this endpoint returns the UNIX timestamp job identifier instead of starting a new backup job.

### Enable backups

The `POST http://{baseURL}/make-backup` endpoint is only valid if you enable the backup API for a node.
You can enable the backup API by starting the node with the `--enable-backup-api` and `--backup-directory` command-line options or by specifying the following configuration settings in the node configuration file:

```yaml
backup:
  api:
    enabled: true
  directory: path-to-backups-directory
```

### Select a backup directory

If you enable the backup API, sending a request the `POST http://{baseURL}/make-backup` endpoint always backs up the RocksDB portion of the Chainweb database.

In most cases, you should locate the backup directory in the same partition as the active RocksDB database.
Storing RocksDB backups in the same partition as the active RocksDB database minimizes the space required and the time it takes to complete backups initially.
Over time—as the active database diverges from the backup copy—the space required will increase. 
If you store the backup on another partition, the backup operation takes longer and the backup copy requires as much disk space as the active RocksDB database.

### Back up the Pact database

Chainweb nodes have two separate databases.
One database—the RocksDB database—stores information about blocks and chains.
A second database—the Pact Sqlite database—stores information about smart contracts and state. 

While backup jobs always back up the RocksDB database, backing up the Pact Sqlite database is optional.
If you include the `backupPact` parameter in your request, the backup job backs up both databases.
Backing up both databases takes much longer than only backing up the RockDB database.
In addition, Pact database backups always require as much space as the active Pact database.

### Define a retention policy

Database backup jobs don't provide any type of automatic backup retention policy.
You should define your own policy and delete old backup copies, as appropriate.

### Query parameters

| Parameter | Description
| --------- | -----------
| backupPact | Indicates that you want to back up both the RockDB database and the Pact database. This option requires additional disk space and increases the time required to complete the backup.

### Responses

Requests to the `POST http://{baseURL}/make-backup` endpoint return the following response code:

- **200 OK** indicates that a backup job has been created.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| backupId | string | Specifies the backup job identifier with a UNIX timestamp from the `a-zA-Z0-9_-` character set.

## Check the status of a backup job

Use `GET http://{baseURL}/check-backup/{backupId}` to check the status of a backup job.

### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| backupId&nbsp;(required) | string | Specifies the backup job identifier with a UNIX timestamp from the `a-zA-Z0-9_-` character set. For example: 1648665437000

### Responses

Requests to the `GET http://{baseURL}/check-backup` endpoint can return the following response codes:

- **200 OK** indicates that a backup job with the specified identifier exists and returns its current status.
- **404 Not Found** indicates that there were no backup jobs matching the specified identifier.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| status | string | Specifies the status of the backup job with the specified identifier. There are three possible status messages: `backup-done`, `backup-in-progress`, and `backup-failed`.

## Check node health

Use `GET http://{baseURL}/health-check` to check whether `chainweb-node` is running and responding to API requests. 
To check the state of consensus, you should use the `GET https://{baseURL}/cut` endpoint instead of this endpoint.

### Responses

Requests to the `/health-check` endpoint return the following response code:

- **200 OK** indicates that the node is running and responding to API requests.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

The response returns `text/plain` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| check | string | Health check OK.

### Examples

You can send a health check request to a node like this:

```Postman
GET http://api.chainweb.com/health-check
```

This request returns a plain text message like this:

```text
Health check OK.
```

## Get general node information

Use `GET http://{baseURL}/info` to return general information about the node and the Chainweb version.

### Responses

Requests to the `GET http://{baseURL}/info` endpoint return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns general information about the node and the chains in the network.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| nodeApiVersion&nbsp;(required) | string | Specifies the Chainweb API version information for the node.|
| nodeBlockDelay&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the number of seconds to delay between blocks. |
| nodeChains&nbsp;(required) | Array&nbsp;of&nbsp;strings| Specifies the chain identifiers for the chains in the network the node is part of. |
| nodeGenesisHeights&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height for the first block of each chain in the network.|
| nodeGraphHistory&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies the block height and adjacent chains in an array with arrays for all chain graphs indexed by the height of the first block with the respective graph. Graphs are encoded as adjacency lists.
| nodeHistoricalChains&nbsp;(required) | Array&nbsp;of&nbsp;integers | Specifies |
| nodeLatestBehaviorHeight&nbsp;(required) | integer | Specifies the latest block height for the node. |
| nodeNumberOfChains&nbsp;(required) | integer&nbsp;>=&nbsp;10 | Specifies the number of chains in the network the node is part of. |
| nodePackageVersion&nbsp;(required) | string | Specifies the release package version for the `chainweb-node` software package running on the node. |
| nodeServiceDate&nbsp;(required) | string | Specifies the next service date for updating the `chainweb-node` software package running on the node. |
| nodeVersion&nbsp;(required) | string | Specifies the network identifier for the network the node is part of. The valid values are  "test-singleton", "development", "mainnet01", and "testnet04".|

### Examples

You can send a request for general information to a node like this:

```Postman
GET http://api.chainweb.com/info
```

This request returns information similar to the following truncated excerpt:

```json
{
    "nodeApiVersion": "0.0",
    "nodeBlockDelay": 30000000,
    "nodeChains": [
        "17",
        "16",
        "19",
    ],
    "nodeGenesisHeights": [
        [
            "17",
            852054
        ],
        [
            "16",
            852054
        ],
        [
            "19",
            852054
        ],
    ],
    "nodeGraphHistory": [
        [
            852054,
            [
                [
                    17,
                    [
                        16,
                        18,
                        2
                    ]
                ],
            ],
        ],
    ],
    "nodeHistoricalChains": [
        [
            852054,
            [
                [
                    17,
                    [
                        16,
                        18,
                        2
                    ]
                ],
            ],
         ],
      ],
    "nodeLatestBehaviorHeight": 4819247,
    "nodeNumberOfChains": 20,
    "nodePackageVersion": "2.24.1",
    "nodeServiceDate": "2024-08-21T00:00:00Z",
    "nodeVersion": "mainnet01"
}
```

## Blocks event stream

Use `GET http://{baseURL}/header/updates` to connect to a source of server events that emits a BlockHeader event for each new block header that is added to the chain database of the remote node.

The stream can contain blocks that might later become orphaned. 
To address this potential issue, you should buffer events on the client side for the most recent block heights to allow for a desired confirmation depth to be reached.

You should note that the server might terminate this event stream from time to time.
It is up to the client to restart event streaming with a new request.

### Responses

- **200 OK** indicates a successful requests and results in a stream of BlockHeader events. 
  Each event consists of an event property and a data property and are separated by empty lines. 

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr | string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

If the request is successful, the response returns `text/event-stream` content with the following:

| Parameter | Type | Description |
| --------- | ---- | -----------
| event | string | Specifies the type of event with the event property value of "BlockHeader".
| data	| object | Specifies the data properties for the event.

### Examples

You can send a request for block header updates from the Kadena main network like this:


```Postman
GET http://api.chainweb.com/chainweb/0.0/mainnet01/header/updates
```

This request returns a stream of events with the BlockHeader event property and a data property:

![BlockHeader event stream](/assets/docs/blockheader-event.png)

If you expand the data property for an event, the event includes details similar to the folloiwng:

```json
{
    "header": {
        "adjacents": {
            "12": "_RU_P5XpRIFJK7-xhClDzBIwRD3LCkNzhNTi4M05uPY",
            "14": "tzNb2_b_nWkGM9Qh3u4Pxna-NU2RYBYEuZE3cwu2m1k",
            "3": "6auRG8JDj4S4IYMF8G-d47dkwVAfX8XmOOg6isofr_M"
        },
        "chainId": 13,
        "chainwebVersion": "mainnet01",
        "creationTime": 1722966936274259,
        "epochStart": 1722966541117672,
        "featureFlags": 0,
        "hash": "mb-Tn9AyDYuP5TgqaAlBu9VgR6eSZdWgKz9qtAGbrDA",
        "height": 5016971,
        "nonce": "5486220440094445593",
        "parent": "ItXSuFMmiQ1tcbXHPD0YoVR-2oip8RAn0m20v09vsTc",
        "payloadHash": "9v4k_U0IjxES-AwUSw_0PsqVBZ65msUKgZcGZO2cbY8",
        "target": "mGwbbeZtKT0EAHYYZTgreADt6mLkayeBEQAAAAAAAAA",
        "weight": "LJy-RUh3OhJ8VwEAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    "powHash": "0000000000000009d25e6c0bfe4f0c07b87af281929d275412c8be921fd9334b",
    "target": "000000000000001181276be462eaed00782b3865187600043d296de66d1b6c98",
    "txCount": 0
}
```