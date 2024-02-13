---
title: Compact a Chainweb node database
description: "Reduce the storage required by the Chainweb node database."
menu: Deploy
label: Compact a Chainweb node database
order: 2
layout: full
tags: [pact, chainweb, network, node operator, developer]
---

# Compact a Chainweb node database

Because a healthy blockchain continuously adds new transactions in new blocks that change the state of the database, managing the storage requirements on individual nodes can be challenging.

To address this issue, Chainweb provides the `cwtool compact` command. 
The `cwtool compact` command enables you to delete historical unused state from the `chainweb-node` Pact SQLite database. 
Removing old state that isn't required to validate state or reach consensus enables your node to use far less disk space overall while maintaining the semantic integrity of your node operations. 

To compact a Chainweb node database:

1. Open a terminal shell on a computer with access to your `chainweb-node` root directory.
2. Get ahold of a `cwtool`  binary, either through a release of `chainweb-node` , or building from source with `cabal`  or `nix` . The [chainweb-node README](https://github.com/kadena-io/chainweb-node#README) documents all the ways you can do this step.
3. Create a backup of your pact sqlite. This isn’t strictly necessary, but is strongly recommended. For most nodes, there will be a directory `0/sqlite`  with all of the sqlite state.
4. Run `cwtool compact` , pointing it to your database:

```bash
cwtool compact \
  --target-blockheight X \
  --pact-database-dir /path/to/sqlite/ \
  --log-dir compaction-logs
```

If we breakdown those arguments:

- TODO: `target-blockheight`  should be computed automatically for user-friendliness. For now, I recommend doing something like 3.5million (”3500000”)
- The `pact-database-dir`  argument takes the path to all of the pact state, i.e. the directory where all of the `*.sqlite`  files are.
- `log-dir`  is the directory where the compaction tool will place its logs. If the directory doesn’t exist, the tool will create it. The compaction tool creates one log file per chain inside of that directory. These logs can be useful if something goes wrong.
1. Now, you should stop your node, swap the original pact state with the compacted pact state, and restart your node. Your node should start and continue as though nothing has changed. Enjoy your space savings!

If something goes wrong, feel free to file an issue on the [chainweb node repo](https://github.com/kadena-io/chainweb-node#issues) or ping a Kadena developer (`@chessai` , `@edmundnoble` , `@johnw9` ) on the Kadena discord.