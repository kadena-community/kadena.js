---
title: Block updates endpoint
description:
  Provides reference information for endpoint you can use to monitor a node for new blocks.
menu: Chainweb API
label: Block updates endpoint
order: 2
layout: full
tags: ['chainweb', 'node api', 'chainweb api', 'api reference']
---

# Block updates endpoint

The block updates endpoint enables you to connect to a server-side event stream to be notified when new blocks are added to the blockchain.

## Monitor events for new blocks

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