---
title: Cut endpoints
description:
  Provides reference information for the chainweb-node /cut endpoints.
menu: Chainweb API
label: Cut endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference', 'block height cut']
---

# Cut endpoints

A **cut** represents a distributed state from a chainweb node. 
It references one block header for each chain, such that those blocks are pairwise concurrent.

Two blocks from two different chains are said to be concurrent if either one of them is an adjacent parent (is a direct dependency) of the other or if the blocks do not depend at all on each other.

## Query the current cut

Use `GET https://{baseURL}/cut` to query a Chainweb node for the current cut.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| maxheight | integer >= 0 | Maximum cut height of the returned cut.

### Responses

Requests to `GET https://{baseURL}/cut` return the following response code:

- **200 OK** indicates that the request succeeded and the response body returns the blockchain state for each chain at the specified block height. 

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

#### Response schema

The response returns `application/json` content with the following information:

| Parameter | Type | Description
| --------- | ---- | -----------
| origin | object | Describes a peer information object that consists of an `id` string and an `address` object for a Chainweb node. The `origin` parameter is required to use the `PUT /cut` endpoint. For more information, see the [Peer information](/reference/chainweb-api/data-models#peer-information-modelh-1716301923) data model.
| height&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the cut height. The cut height is the sum of the height for all of the blocks included in the cut. You should avoid using this value because its semantics may change in the future.
| weight&nbsp;(required) | string | Specifies the cut weight. The cut weight is the sum of the weights from all of the blocks included in the cut. The weight string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| hashes&nbsp;(required) | object | Specifies an object that maps chain identifiers 0-19 to their respective block hash and block height for the cut.
| instance | string | Specifies the network identifier for the cut.
| id | string | Specifies a cut identifier. The id string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

### Examples

You can send a request to a bootstrap node for the Kadena main network with a call like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut?maxheight=4833114
```

The response header for this request looks like this:

```text
X-Server-Timestamp: 1717448611
X-Peer-Addr: 54.86.50.139:49795
X-Chainweb-Node-Version: 2.24
Content-Type: application/json;charset=utf-8
```

The response body for this request returns the state for each chain with the maximum block height of 483314:

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
  "origin":null,
  "weight":"yQadPJMTi0wrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "height":4833110,
  "instance":"mainnet01",
  "id":"unhwBpXkw-Pa9hulGzExDev40Ju7VelHTg1zArwsoOU"
}
```

Note that this sample request was sent to a bootstrap node for the Kadena public blockchain, so the `origin` is `null`.
If you want to publish a cut, you must send the request to a Chainweb node that returns a value for the `origin` property.

## Publish a cut

Use `PUT https://{baseURL}/cut` to publish a cut to a Chainweb node.
The cut must contain an `origin` property that is not null. 
The receiving node will first try to obtain all missing dependencies from the node specified for the `origin` property before searching for the dependencies in the peer-to-peer network.

### Request body schema

Use the following parameters to specify a `cut` with an `origin` property that is not null.

| Parameter | Type | Description
| --------- | ---- | -----------
| origin (required) | object | Describes a peer information object that consists of an `id` string and an `address` object for a Chainweb node. The `origin` parameter is required to use the `PUT /cut` endpoint. For more information, see the [Peer information](/reference/chainweb-api/data-models#peer-information-modelh-1716301923) data model.
| height&nbsp;(required) | integer&nbsp;>=&nbsp;0 | Specifies the cut height to publish. The cut height is the sum of the height for all of the blocks included in the cut. You should avoid using this value because its semantics may change in the future.
| weight&nbsp;(required) | string| Specifies the cut weight. The cut weight is the sum of the weights from all of the blocks included in the cut. The weight string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| hashes&nbsp;(required) | object | Specifies an object that maps chain identifiers 0-19 to their respective block hash and block height for the cut.
| instance | string | Specifies the network identifier for the cut.
| id | string | Specifies a cut identifier. The id string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.

### Responses

Requests to `PUT https://{baseURL}/cut` return the following response codes:

- **204 No Content** indicates that the request was successful and the cut was added to the cut processing pipeline on the remote Chainweb node.
- **401 Unauthorized** indicates that the node where you are trying to publish the cut is not a peer of the node identified in the `origin` property, and therefore cannot process the cut you're attempting to publish.

#### Response header

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote Chainweb node. The host address can be a domain name or an IP address in IPv4 or IPv6 format. For example: `"10.36.1.3:42988"`.
| x-server&#8209;timestamp | integer&nbsp;>=&nbsp;0 | Specifies the clock time of the remote Chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x&#8209;chainweb&#8209;node&#8209;version	| string | Specifies the version of the remote Chainweb node. For example: `"2.23"`.

### Examples

You can send a request to publish a cut on a node with a call to the `/cut` endpoint similar to the following:

```Postman
PUT https://sfchainweb.example.com/chainweb/0.0/testnet04/cut
```

The request body for publishing a cut contains parameters similar to the following:

```json
{
   "origin": {
      "address": {
        "hostname": "85.238.99.91",
        "port": 30004
        },
      "id": "PRLmVUcc9AH3fyfMYiWeC4nV2i1iHwc0-aM7iAO8h18"
    },
    "height": 30798466,
    "weight": "b0wYplmNiTBXCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "hashes": {
      "0": {
        "height": 1539923,
        "hash": "qEaSmWt_tDcJC9AGbgWY9x12LW5VED7hGgfyz9x_S3w"
      },
      "1": {
        "height": 1539923,
        "hash": "TJuC6nfhamfD517gspAZmqD9umR71nAgttDOi1JbBHw"
      },
      "2": {
        "height": 1539924,
        "hash": "4ineCWfnO1rneWuBMLPzqTl2HF_sZpypT_3TEzf3VLc"
      },
      "3": {
        "height": 1539924,
        "hash": "ZEOMXB2ByqzL2HfYVKIZKAnoe4wIeJ2SaltnXDir59k"
      },
      "4": {
        "height": 1539923,
        "hash": "0g0rOoSznVW2BJDBmK0Lbxz22F-sxTZUNIrUs_Q8Ye4"
      },
      "5": {
        "height": 1539923,
        "hash": "5y_TL-clnF_wELMBKyJk0Sz8RVShw_bGQETJdrMkADA"
      },
      "6": {
        "height": 1539923,
        "hash": "YkQKv6P4_C4jRM3RqKK9FWPxIneeLzlkKQS9ATAQYRk"
      },
      "7": {
        "height": 1539923,
        "hash": "j_hJ9iiH_ATyeQeeRN3auGXjbBWiFgnTU0dYPIz8cKM"
      },
      "8": {
        "height": 1539924,
        "hash": "s7c3B55VbDsS6EJ-nc9S5k2kNbPOBGI8xxF3vUg4d4Q"
      },
      "9": {
        "height": 1539922,
        "hash": "bowQf63xSY9owHKhK1yGee2Q0Fn8yL_oCLaEUn-CGoA"
      },
      "10": {
        "height": 1539924,
        "hash": "uP-pHW4QKrV9fN1mlDGwKuaiIDlJW7xYSj1nW53EHM4"
      },
      "11": {
        "height": 1539924,
        "hash": "TIhegjZ0GEC73T4m0BVuFtfLNGuS56IUWEuf93AJ5UU"
      },
      "12": {
        "height": 1539923,
        "hash": "-j1qcAS9Fs-WQmc3WEhzZ96VojxnlIA2TFpfyIv31Zs"
      },
      "13": {
        "height": 1539923,
        "hash": "S-4TqMgWGlK1k33XRlU9w0Lfwr0RvkO5Jn78Au1OglM"
      },
      "14": {
        "height": 1539923,
        "hash": "xSuULf--S4TrgYNz82deaGhnPLWrg3pXkynGeUPUGwA"
      },
      "15": {
        "height": 1539923,
        "hash": "jsc9rugvcHXDiBAuoO9_j8R_b_jchtJJ8b5596i8wVg"
      },
      "16": {
        "height": 1539923,
        "hash": "qs1aEY8kSxfUBb_JRVswv5dYINRXBjGJteC-6RC1hjc"
      },
      "17": {
        "height": 1539924,
        "hash": "xzVBXaQxzlUfUrakDgppUubQBRXGh-Uy0HBdMNwCq_Y"
      },
      "18": {
        "height": 1539924,
        "hash": "4VOHPAqwioySYRycdl5MxfscQHwtlwwCAt7AySYQT98"
      },
      "19": {
        "height": 1539923,
        "hash": "1PrRg20XyQ_2cfgGOgNK9K-cqIJ1vO8-A-RJlfN5m00"
      }
    },
    "id": "BBz7KeurYTeQ0hMGbwUbQC84cRbVcacoDQTye-3qkXI",
    "instance": "mainnet01"
}
```

If the request is successful, you'll see the **204 No Content** response returned.