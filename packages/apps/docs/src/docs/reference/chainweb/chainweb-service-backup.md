---
title: Backup endpoints
description:
  Provides reference information for the endpoints you can use to start or query the status of database backups for a node.
menu: Chainweb API
label: Backup endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Backup endpoints

You can configure a Chainweb node to support database backup jobs.
If you enable the backup API for a node, you can use the backup endpoints to a start backup job and check the status of a previously started backup job.

## Enable backups

The `/make-backup` and `/check-backup` endpoints are only valid if you enable the backup API for a node.
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

## Start a backup job

Use `POST http://{baseURL}/make-backup` to start a backup job for a Chainweb node.
Starting a backup job creates a UNIX timestamp identifier for the job.
You can then use the identifier to check the status of the job to determine if the job is still in progress or the backup has been completed.

If a backup job is already in progress, this endpoint returns the UNIX timestamp job identifier instead of starting a new backup job.


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
