---
title: Cut endpoints
description:
  Provides reference information for the chainweb-node /cut endpoints.
menu: Chainweb API
label: Cut endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Cut endpoints

A **cut** represents a distributed state from a chainweb node. 
It references one block header for each chain, such that those blocks are pairwise concurrent.

Two blocks from two different chains are said to be concurrent if either one of them is an adjacent parent (is a direct dependency) of the other or if the blocks do not depend at all on each other.

## Query the current cut

Use `GET /cut` to query a chainweb node for the current cut.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| maxheight | integer >= 0 | Maximum cut height of the returned cut.

### Responses

Requests to `/cut` can return the following response codes:

- **200 OK** indicates that the request succeeded and returns the blockchain state for the specified block height. 

#### Response header

The response header contains the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: "10.36.1.3:42988"
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: 1618597601
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote chainweb node. For example: "2.23"

#### Response schema

The response returns application/json content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| origin | object | Describes a peer information object that consists of an `id` string and an `address` object for a Chainweb node. The `origin` parameter is required to use the `PUT /cut` endpoint. For more information, see the [Peer information](#peer-information) data model.
| height&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the cut height. The cut height is the sum of the height for all of the blocks included in the cut. You should avoid using this value because its semantics may change in the future.
| weight&nbsp;(required) | string | Specifies the cut weight. The cut weight is the sum of the weights from all of the blocks included in the cut. The weight string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| hashes&nbsp;(required) | object | Specifies an object that maps chain identifiers 0-19 to their respective block hash and block height for the cut.
| instance | string | Specifies the network identifier for the cut.
| id | string | Specifies a cut identifier. The id string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

#### Example

Send a request to the Kadena main network:

GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut?maxheight=4833114

##### Response header

```text
X-Server-Timestamp: 1717448611
X-Peer-Addr: 54.86.50.139:49795
X-Chainweb-Node-Version: 2.24
Content-Type: application/json;charset=utf-8
```

##### Response body

```json
{
  "hashes":
  {
    "5":{
      "height":483311,
      "hash":"3uC7pcfNDQLBnkSEXak5-SJDTQDzOcCu-hzLdZB5SZY"
    },
    "4":{
      "height":483311,
      "hash":"-J7wrfvBhTV_4FMEwzcUczchURV3vR8X1Iw6_70Vdcw"
    },
    "7":{
      "height":483311,
      "hash":"Th5sqaG-czuzwwqJplj_tqJrp9C09mFFESqpxZ_n5TM"
    },
    "6":{
      "height":483311,
      "hash":"jGXtsEywkJiDd0QdTou3vP-7-s_5tf49DFq0BP0roBs"
    },
    "1":{
      "height":483311,
      "hash":"-v_J5dWJIsBa760sVDXg69OizfWvhK10VRtDDlGq4-M"
    },
    "0":{
      "height":483311,
      "hash":"pG1qqlfEaCkCcIw1cPMcFt4ELRbHVsFqtmx287DZzfw"
    },
    "3":{
      "height":483311,
      "hash":"_dZeAaGioNKP3eEMfI7yLw49RGaiSc57L7bKged_Uf0"
    },
    "2":{
      "height":483311,
      "hash":"belGw7zEJah0nNrP-jw7LarZSTt_NMlqAzvIDS40Fgo"
    },
    "9":{
      "height":483311,
      "hash":"--PHSuDXqCIXnGDXc0w49VT9yA-BJ_vwLil2IIAkrk4"
    },
    "8":{
      "height":483311,
      "hash":"1kDMHN7wEE51E1yDew16WE8GFWfSXBCpmV5Koy00Mjg"
    }
  },
  "origin":null,"weight":"yQadPJMTi0wrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "height":4833110,
  "instance":"mainnet01",
  "id":"unhwBpXkw-Pa9hulGzExDev40Ju7VelHTg1zArwsoOU"
}
```

## Publish a cut

Use `PUT /cut` to publish a cut to a Chainweb node.
The cut must contain an `origin` property that is not null. 
The receiving node will first try to obtain all missing dependencies from the node specified for the `origin` property before searching for the dependencies in the peer-to-peer network.

### Request body schema

Use the following parameters to specify a cut with an `origin` property that is not null.

| Parameter | Type | Description
| --------- | ---- | -----------
| origin (required) | object | Describes a peer information object that consists of an `id` string and an `address` object for a Chainweb node. The `origin` parameter is required to use the `PUT /cut` endpoint. For more information, see the [Peer information](#peer-information) data model.
| height&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the cut height to publish. The cut height is the sum of the height for all of the blocks included in the cut. You should avoid using this value because its semantics may change in the future.
| weight&nbsp;(required) | string| Specifies the cut weight. The cut weight is the sum of the weights from all of the blocks included in the cut. The weight string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| hashes&nbsp;(required) | object | Specifies an object that maps chain identifiers 0-19 to their respective block hash and block height for the cut.
| instance | string | Specifies the network identifier for the cut.
| id | string | Specifies a cut identifier. The id string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

### Responses

Requests to `/cut` can return the following response codes:

- **204 No Content** indicates that the cut was added to the cut processing pipeline on the remote node.
- **401 Unauthorized** indicates that the node where you are trying to publish the cut is not a peer of the node identified in the `origin` property, and therefore cannot the cut.

#### Response header

The response header parameters are the same for successful and unsuccessful requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: "10.36.1.3:42988"
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: 1618597601
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: "2.23"
