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

To address this storage issue, Chainweb provides the `compact` command-line program.
The `compact` command enables you to delete historical unused state from the `chainweb-node` chain RocksDB database and the Pact SQLite database.
Removing old state that isn't required to validate transactions or reach consensus enables your node to use far less disk space overall while maintaining the semantic integrity of node operations.

To compact a Chainweb node database:

1. Open a terminal shell on a computer with access to the `chainweb-node` you manage.

   For example, if you run the node in a Docker container, open a terminal in the container.
   If you installed `chainweb-node` from a release binary or built it from source, open a terminal or secure shell on the computer where the binary is installed.

   For information about installing `chainweb-node` from a release binary or building it from the source code, see the [chainweb-node README](https://github.com/kadena-io/chainweb-node#README).

2. Verify that you have access to the `compact` command-line program by running the following command:

   ```bash
   compact --help
   ```

   If you have access to the `compact` program, you should see usage information similar to the following:

   ```bash
   Chainweb Tool

   This executable contains misc commands that have been created for various
   reasons in the course of Chainweb development. Linking executables is slow and
   the resulting binaries are large, so it is more efficient in terms of build
   time, space usage, download time, etc to consolidate them into one binary.

   Usage: cwtool COMMAND

   Available options:
     -h,--help                Show this help text

   Available commands:
     ea                       Generate Chainweb genesis blocks and their payloads
     run-nodes                Run a local cluster of chainweb-node binaries
     slow-tests               Run slow Chainweb tests
     tx-list                  List all transactions in a chain starting with the most recent block
     genconf                  Interactively generate a chainweb-node config
     header-dump              Dump Block Headers to a JSON array
     b64                      Command line utlis for Chainweb base64 encode/decode
     db-checksum              Generate a checksum of all the checkpointer database tables between an inclusive range of blocks.
     known-graphs             Encode know graphs as JSON values
     tx-sim                   Simulate tx execution against real pact dbs
     compact                  Compact pact database
     pact-diff                Diff the latest state of two pact databases
     calculate-release        Calculate next service date and block heights for upgrades
   ```

3. Create a backup copy of your current pact `sqlite` database to save all current state by running a command similar to the following:

   ```bash
   cp -r /data/state/chainweb/db/0/sqlite /tmp/sqlite-backup-dd-mm-yyyy
   ```

   Creating a backup copy of the database requires you to have more disk space available to store both the active database and the backup until you complete the compaction.
   However, creating a backup ensures that the node continues to run uninterrupted while the database is being compacted.
   The backup also ensures tht you can restore the database if something goes wrong with the compacted database.

4. Compact your backup `sqlite` database by running the `cwtool compact` command with the following arguments:

   - `--target-blockheight` to keep enough state available to continue validating blocks after the database has been compacted. An appropriate value depends on the network your node is connected to. For example, if you are compacting your local development network for testing purposes, you would set a lower block height than a node connected to the Kadena test network (`testnet`) or main network (`mainnet`). For a node connected to `mainnet`, it's recommended to use a value of about 4.6 million ("4600000"). In the near future, this option will be removed, and this value will be computed automatically.
   - `--pact-database-dir` to specify the path to the backup pact `sqlite` state where all of the `*.sqlite`  files are located.
   - `--log-dir` to specify the directory where you want `cwtool compact` to put the log files it creates, one for each chain. If the directory doesn’t exist, `cwtool compact` creates it. These logs can be useful if something goes wrong.

   For example, run a command similar to the following:
   ```bash
   cwtool compact \
     --target-blockheight 4600000 \
     --pact-database-dir /tmp/sqlite-backup-dd-mm-yyyy \
     --log-dir /tmp/compact-sqlite-logs
   ```

5. Stop your node, replace the original pact `sqlite` state with the newly compacted `sqlite` state from the backup by running a command similar to the following:

   ```bash
   mv /tmp/sqlite-backup-dd-mm-yyyy /data/state/chainweb/db/0/sqlite
   ```

6. Restart your node.

   Your node should start normally and continue running with the reduced database size as though nothing has changed.
   As a precaution, you should keep the backup copy of the database available—in a compressed format, if necessary—until you're sure that you won't need to restore from it.

If you encounter errors or warnings, open a new issue for [chainweb-node](https://github.com/kadena-io/chainweb-node#issues) or contact Kadena developers in the [infrastructure](https://discord.com/channels/502858632178958377/1051827506279370802) channel on the Kadena Discord server.