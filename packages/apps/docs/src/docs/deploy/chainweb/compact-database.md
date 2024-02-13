---
title: Compact a Chainweb node database
subTitle: "Deploy Chainweb nodes and Pact smart contract applications"
id: deploy
description: "Learn how to deploy Chainweb nodes and Pact smart contract applications on the Kadena network."
menu: Deploy
label: Compact a Chainweb node database
order: 1
layout: full
tags: [pact, chainweb, network, node operator, developer]
---

# Compaction User Docs

Compaction is the process of clearing out old, inactive Pact state from your chainweb-node’s Pact SQLite database. This is purely for saving (a lot of) disk space, while retaining semantic integrity of your node’s operations. Note that compaction is still experimental, so it’s recommended to create backups of any relevant files. The standard way that a user should run compaction is like so:

1. Get ahold of a `cwtool`  binary, either through a release of `chainweb-node` , or building from source with `cabal`  or `nix` . The [chainweb-node README](https://github.com/kadena-io/chainweb-node#README) documents all the ways you can do this step.
2. Create a backup of your pact sqlite. This isn’t strictly necessary, but is strongly recommended. For most nodes, there will be a directory `0/sqlite`  with all of the sqlite state.
3. Run `cwtool compact` , pointing it to your database:

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