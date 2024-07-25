---
title: Peer endpoints
description:
  Provides reference information for the chainweb-node peer endpoints.
menu: Chainweb API
label: Peer endpoints
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Peer endpoints

The peer-to-peer communication between Chainweb nodes is split into specialized independent peer-to-peer networks that different nodes are part of. 
The `cut` peer-to-peer network is responsible for communicating the consensus state across the distributed network nodes. 
There is also a separate memory pool (`mempool`) peer-to-peer network for each chain to queue pending transactions.

## Get cut network peer information

Use GET https://{baseURL}/cut/peer to query peer node information for a specific Chainweb node.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer >= 0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower. For example: `limit=3`.
| next | string | Specifies the cursor to retrieve the next page of results. This value can be found as the value of the `next` property of the previous page. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.

### Responses

Requests to `GET https://{baseURL}/cut/peer` return the following response code:

- **200 OK** indicates that the request succeeded. The response body desribes the peers from the peer database on the remote node.

#### Response headers

The response header parameters are the same for all successful and unsuccessful Chainweb node requests.

| Parameter | Type | Description
| --------- | ---- | -----------
| x-peer-addr	| string | Specifies the host address and port number of the client as observed by the remote chainweb node in the format ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$. For example: `"10.36.1.3:42988"`.
| x-server-timestamp | integer >= 0 | Specifies the clock time of the remote chainweb node using the UNIX epoch timestamp. For example: `1618597601`.
| x-chainweb-node-version	| string | Specifies the version of the remote chainweb node. For example: `"2.23"`.

#### Successful response schema

If the request is successful, the response returns `application/json` content with the following:

| Parameter | Type | Description
| --------- | ---- | -----------
| items (required) | Array of objects | Returns an array of peer information objects.
| limit (required) | integer >= 0 | Specifies the maximum number of items in the page. This number can be smaller but never larger than the number of requested items.
| next (required) | string or null | Returns a value that can be used to query the next page. You can use this value for the `next` parameter in a follow-up request. The format for this parameter consists of two parts. The first part of the string can be `inclusive`, `exclusive`, or null. The second part is the value that calls the next page of results or null if there are no more results to query.

### Examples

You can send a request to a Kadena main network bootstrap node by calling the peer-to-peer endpoint like this:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut/peer?limit=2
```

This request returns two items with peer information in the response body:

```json
{
    "limit": 2,
    "items": [
        {
            "id": "70HnUJJN41Ee-miB5ZlsqDJW3TRcTV5fZ9vM_Gw332k",
            "address": {
                "hostname": "65.109.98.245",
                "port": 1789
            }
        },
        {
            "id": null,
            "address": {
                "hostname": "fr1.chainweb.com",
                "port": 443
            }
        }
    ],
    "next": "inclusive:2"
}
```

To send a follow-up request to get peer information for the next two peers, you can add the `next` parameter to the request:

```Postman
GET https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut/peer?limit=2&next=inclusive:2
```

This request returns the next two items from the peer database in the response body:

```json
{
    "limit": 2,
    "items": [
        {
            "id": "YhmXbYrjrVwUEtIRkwroJ5RPB2tnPqH6qMPsXgi6BOg",
            "address": {
                "hostname": "47.253.46.121",
                "port": 8443
            }
        },
        {
            "id": "tfgiwMyznf8M7p8mP99aEamD2mbvp9DLQCkRXyvsuFc",
            "address": {
                "hostname": "149.154.176.34",
                "port": 31350
            }
        }
    ],
    "next": "inclusive:4"
}
```

## Put cut network peer information

Use `PUT https://{baseURL}/cut/peer` to add a host to the peer database of the `cut` peer-to-peer network on the remote host.

### Request body schema

Use the following parameters to specify the peer information you want to add to the peer database of the cut peer-to-peer network on the remote host.

| Parameter | Type | Description
| --------- | ---- | -----------
| id (required) | string or null | Specified the base64Url-encoded string without padding that represents the SHA256 fingerprint of the SSL certificate for the remote node. This field can only be `null` if the node uses an official certificate authority (CA) signed certificate. In all other cases, the `id` string consists of 43 characters from the [`a-zA-Z0-9_-`] character set.
| address (required) | object | Specifies the host and port number of the peer. 

### Responses

Requests to `PUT https://{baseURL}/cut/peer` return the following response codes:

- **204 No Content** indicates that the request was successful and the peer was added to the peer database of the remote node.
- **400 Bad Request** indicates that the request itself is invalid or that the hostname and port provided for the peer is not reachable. Before a Chainweb node adds a peer to its peer database, the node checks whether the peer can be reached using the information provided. If this check fails, an error is returned.

### Examples

{
"address": {
"hostname": "85.238.99.91",
"port": 30004
},
"id": null
}
Response samples
400
Content type
text/plain

Copy
Invalid hostaddress: IsNotReachable (PeerInfo {_peerId = Nothing, _peerAddr = HostAddress {_hostAddressHost = us-w1.chainweb.com, _hostAddressPort = 444}}) "\"HttpExceptionRequest Request {\\n  host                 = \\\"us-w1.chainweb.com\\\"\\n  port                 = 444\\n  secure               = True\\n  requestHeaders       = [(\\\"X-Chainweb-Node-Version\\\",\\\"2.6\\\")]\\n  path                 = \\\"/chainweb/0.0/mainnet01/cut/peer\\\"\\n  queryString          = \\\"\\\"\\n  method               = \\\"GET\\\"\\n  proxy                = Nothing\\n  rawBody              = False\\n  redirectCount        = 10\\n  responseTimeout      = ResponseTimeoutMicro 2000000\\n  requestVersion       = HTTP/1.1\\n}\\n ConnectionTimeout\""

## Get mempool network peer information

Use `GET https://{baseURL}/chain/{chain}/mempool/peer`


### Path parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| chain (required) | integer >= 0 | Specifies the chain identifier of the chain you want to send the request to. Valid values are 0 to 19. For example, to get block hashes for the first chain (0), the request is `GET https://{baseURL}/chain/0/mempool/peer`.

### Query parameters

| Parameter | Type | Description
| --------- | ---- | -----------
| limit | integer >= 0 | Specifies the maximum number of records that should be returned. The actual number of records returned might be lower than the value you specify. For example: `limit=3`.
| next | string | Specifies the cursor value to retrieve the next page of results. You can find the value to specify in the `next` property returned by the previous page in a successful response. For example: `"inclusive:qgsxD1G5m8dGZ4W9nMKBotU2I10ilURkRIE3_UKHlLM"`.

### Responses
200 Peer information
RESPONSE HEADERS
x-peer-addr	
string (Host Address) ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$
Example: "10.36.1.3:42988"
Host and port of the client as observed by the remote node

x-server-timestamp	
integer (POSIX Timestamp) >= 0
Example: 1618597601
The time of the clock of the remote node

x-chainweb-node-version	
string
Example: "2.6"
The version of the remote chainweb node

RESPONSE SCHEMA: application/json
items
required
Array of objects (Peer)
Array of peers

limit
required
integer >= 0
The number of items in the page. This number can be smaller but never be larger than the number of requested items.

next
required
(null or null) or (string or null)^(inclusive|exclusive):.*$
A cursor that can be used to query the next page. It should be used literally as value for the next parameter in a follow-up request.

Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"value": {
"next": "inclusive:3",
"items": [],
"limit": 3
}
}
Put Chain Mempool-Network Peer Info

PUT
/chain/{chain}/mempool/peer





PATH PARAMETERS
chain
required
integer >= 0
Example: 0
the id of the chain to which the request is sent

REQUEST BODY SCHEMA: application/json
The peer that is added to the peer database of the mempoo P2P network of the chain {chain} of remote host.

id
required
string or null[a-zA-Z0-9_-]{43}
The base64Url (without padding) encoded SHA256 fingerprint of the SSL certificate of the node. This can be null only if the node uses an official CA signed certificate

address
required
object
Responses
204 The peer got added to the peer database of the remote node.
RESPONSE HEADERS
x-peer-addr	
string (Host Address) ^\d{4}.\d{4}.\d{4}.\d{4}:\d+$
Example: "10.36.1.3:42988"
Host and port of the client as observed by the remote node

x-server-timestamp	
integer (POSIX Timestamp) >= 0
Example: 1618597601
The time of the clock of the remote node

x-chainweb-node-version	
string
Example: "2.6"
The version of the remote chainweb node

400 Bad Request. The request is invalid. It is either malformed or the provided peer is not reachable. Before the remote node addes a peer to its peer database it checks whether the peer can be reached via the provided address. If this check fails an error is returned.
Request samples
Payload
Content type
application/json

Copy
Expand allCollapse all
{
"address": {
"hostname": "85.238.99.91",
"port": 30004
},
"id": null
}
Response samples
400
Content type
text/plain

Copy
Invalid hostaddress: IsNotReachable (PeerInfo {_peerId = Nothing, _peerAddr = HostAddress {_hostAddressHost = us-w1.chainweb.com, _hostAddressPort = 444}}) "\"HttpExceptionRequest Request {\\n  host                 = \\\"us-w1.chainweb.com\\\"\\n  port                 = 444\\n  secure               = True\\n  requestHeaders       = [(\\\"X-Chainweb-Node-Version\\\",\\\"2.6\\\")]\\n  path                 = \\\"/chainweb/0.0/mainnet01/cut/peer\\\"\\n  queryString          = \\\"\\\"\\n  method               = \\\"GET\\\"\\n  proxy                = Nothing\\n  rawBody              = False\\n  redirectCount        = 10\\n  responseTimeout      = ResponseTimeoutMicro 2000000\\n  requestVersion       = HTTP/1.1\\n}\\n ConnectionTimeout\""
