---
title: Troubleshoot Chainweb
description:
  If you're running a node and getting something like this the following, then
  it means that peer synchronization has failed
menu: Troubleshoot Chainweb
label: Troubleshoot Chainweb
order: 4
layout: full
---

# Troubleshooting Chainweb

## Running a Node

### Peer Sync Errors

If you're running a node and getting something like this the following, then it
means that peer synchronization has failed:

```bash title=" "
  (InternalException (HostCannotConnect "76.170.96.97" [Network.Socket.connect: <socket: 142>: does not exist (Connection refused)])))
2019-11-01T05:10:29.869Z [Warn] [chainwebVersion=mainnet01|peerId=E--IPo|port=4430|host=<some host>|component=cut|sub-component=sync|sync=payload] failed to sync peers from <some node>:7463#Asb8rw: ConnectionError (HttpExceptionRequest Request {
  host                 = "<some host>"
  port                 = 7463
  secure               = True
  requestHeaders       = [("Accept","application/json;charset=utf-8,application/json")]
  path                 = "/chainweb/0.0/mainnet01/cut/peer"
  queryString          = ""
  method               = "GET"
  proxy                = Nothing
  rawBody              = False
  redirectCount        = 10
  responseTimeout      = ResponseTimeoutMicro 10000000
  requestVersion       = HTTP/1.1
}
```

This can happen for a variety of reasons.

**Out of date binaries**

One of the most prevalent is that a node is attempting to enter the network with
out of date binaries or dependencies. For example, if a node is attempting to
synchronize with an improper version of `librocksdb`, then peer synchronization
will fail. The solution is to make that all are up to date with the most recent
official release of `chainweb-node`.

**Timeout exceptions**

If the synchronizing node fails to provide timely feedback, nodes will receive a
timeout exception. In general this is fine, and only considered a warning. No
cause for alarm, and nodes can sync to alternative nodes in the meantime. These
exceptions are usually post-fixed by a `ConnectionTimeout` statement.

**Something went wrong**

"Something went wrong" exceptions are thrown when an internal server error
occurs due to misconfiguration. Just in case, however, consider asking in the
Discord to check with us and make sure your node is configured correctly and on
a happy path.

### Regenerate deleted configs

Issue `./chainweb-node --print-config` to create a fresh config yaml.

## Mining KDA

### Discover peers to mine

Every Chainweb node maintains a list of peers. If you want a list of peers to
mine, curl the `/cut/peer` endpoint on any node to discover its list of peers. A
good start would be any bootstrap node:

```bash title=" "
→ curl -sk "https://us-e2.chainweb.com/chainweb/0.0/mainnet01/cut/peer" | python -m json.tool | grep hostname
                "hostname": "foo.com"
                "hostname": "blah.org"
                ...
```

### See if a node is minable

Keep up to date with the list of minable nodes, or to test or yourself, point
your miner at any of the available nodes and see if it starts mining. This is
easiest if you set the default log level to `debug`. For example:

```bash title=" "
./chainweb-miner cpu --cores 2 --node us-w2.chainweb.com:443 --miner-account <some account> --miner-key <some key>  --log-level debug
```

### Balance isn't showing up after mining a block

Proof-of-Work algorithms rely on the fact that only one winning chain is chosen
after a certain length of time. In the meantime, there can be many competing
chains which can become several (up to 10's of) blocks long on which you'll see
your miner potentially winning blocks. When a winner is chosen and the forks
resolve, only those blocks mined by miners on the winning chain will be
perceived by the network to be correct, and they will be awarded a block reward.
As a result, you can do mining for a while and win a ton of blocks, but if
you're mining on a fork you may subsequently not see a change in balance if the
fork does not win the race. The solution to this is to help contribute to a
healthy distribution of hash power across the network by running your own node
and making sure not to centralize your mining attempts on particularly powerful
nodes.

### 404 Errors

Miners will receive 404 errors when miners fail to connect to a node. This can
happen for a variety of reasons:

**Network misconfiguration**

If you do not have incoming and outgoing SSL traffic enabled on your router,
miners will 404. Please make sure that you have the correct router
configuration. NATs tend to be a problem if you are running on AWS. Make sure
this is _off_.

**The node is down**

If you receive a 404, the node may be down. Diagnose this by either pinging a
node with `ping -c 3 <node ip>` and seeing if it pings back or sending a cURL
request to a node's health check endpoint:

```bash title=" "
curl -k https://<node-ip>:443/health-check
```

A healthy node should return the following:

```bash title=" "
Health check OK.
```

If a node is down, simply switch your miner to a new node which is up. In
general, bootstrap nodes should always be up for mining, but it is usually
fastest to mine to a peer due to lower congestion rates.
