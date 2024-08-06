---

title: Compact Chainweb node databases
description: "Reduce the storage required by the Chainweb node databases."
menu: Deploy
label: Compact a Chainweb node database
order: 2
layout: full
tags: [pact, chainweb, network, node operator, developer]

---
# Compact Chainweb node databases

Because a healthy blockchain continuously adds new transactions in new blocks that change the state of the database, managing the storage requirements on individual nodes can be challenging.

To address this storage issue, Chainweb provides the `compact` command-line program.
The `compact` command enables you to delete historical unused state from the `chainweb-node` RocksDB database and the Pact SQLite database.
Removing old state that isn't required to validate transactions or reach consensus enables your node to use far less disk space overall while maintaining the semantic integrity of node operations.

After you compact the state and restart the node to use the compacted database, you can delete the old database to further reduce your storage overhead or save the old database in another location as a backup.

To compact a Chainweb node database:

1. Open a terminal shell on a computer with access to the `chainweb-node` you manage.

   For example, if you run the node in a Docker container, open a terminal in the container.
   If you installed `chainweb-node` from a release binary or built it from source, open a terminal or secure shell on the computer where the binary is installed.

   For information about installing `chainweb-node` from a release binary or building it from the source code, see the [chainweb-node README](https://github.com/kadena-io/chainweb-node#README).

   If you run the node in a Docker container, pull the latest image to download the `compact` binary.
   If you built the node from the source code, you can rebuild to get the `compact` binary.

2. Verify that you have access to the `compact` command-line program by running the following command:

   ```bash
   compact --help
   ```

   If you have access to the `compact` program, you should see usage information similar to the following:

   ```bash   
   Usage: compact [--chainweb-version ARG] --from ARG --to ARG [--parallel]
                  --log-dir ARG

     Pact DB Compaction Tool - create a compacted copy of the source database
     directory Pact DB into the target directory.
   
   Available options:
     --from ARG               Directory containing SQLite Pact state and RocksDB
                              block data to compact, expected to be in
                              $DIR/0/{sqlite,rocksDb}.
     --to ARG                 Directory where to place the compacted Pact state and
                              block data. It will place them in
                              $DIR/0/{sqlite,rocksDb}, respectively.
     --parallel               Turn on multi-threaded compaction. The threads are
                              per-chain.
     --log-dir ARG            Directory where compaction logs will be placed.
     -h,--help                Show this help text
   ```

3. Compact your `rocksdb` and `sqlite` databases by running the `compact` command with the following arguments:

   - `--from` to specify the path to the database directory you want to compact. You should specify the database root directory that contains the `0/sqlite` and `0/rocksdb` subdirectories. For example, the `data/state/chainweb/db` directory is the root directory for the `data/state/chainweb/db/0/sqlite` directory and the `data/state/chainweb/db/0/rocksdb` directory.
   - `--to` to specify the path to the compacted database. The compact program writes the compacted databases to the `$DIR/0/sqlite` and `$DIR/0/rocksdb` subdirectories within the directory you specify.
   - `--log-dir` to specify the directory where you want the `compact` program to put the log files it creates, one for each chain. If the directory doesn’t exist, the `compact` program creates it. These logs can be useful for debugging if something goes wrong.
   - `--chainweb-version` to specify the network identifier for the node. This argument is optional if you're compacting a database for the `mainnet01` network. If you're compacting a database for another network—for example, the Kadena test network—you must specify the network identifier. Valid values are "`development`", "`testnet04`", and "`mainnet01`".

   For example, if you have navigated to the `data/state/chainweb` directory on a testnet node, run a command similar to the following:

   ```bash
   compact --from db --to compact-testnet-db --log-dir /tmp/compact-db-logs --chainweb-version testnet04
   ```

   Note that the location of the Chainweb root database directory—`data/state/chainweb/db` in this example—depends on the configuration of the node.
   If you haven't specified a location in the configuration file, the default location is `~/.local/share/chainweb-node/{chainweb-network-id}`, for example `~/.local/share/chainweb-node/testnet04` for a node in the Kadena test network.

4. Stop your node.

5. Restart your node with the new compacted database directory.
   
   You can specify the new compacted database directory as a command-line option or edit the node configuration file you use to set the new compacted database directory.

   For example, you can restart the node with a command similar to the following:

   ```bash
   chainweb-node --database-directory=compact-testnet-db
   ```

   If you're editing the configuration file, update the YAML or JSON file to set the databaseDirectory field to the location of the compacted database.
   For example:

   ```yaml 
   chainweb:
     allowReadsInLocal: false
     backup:
       api:
         configuration: {}
         enabled: false
       directory: null
     databaseDirectory: compact-testnet-db
   ```

   After you restart the node, it should run normally with the reduced database size as though nothing has changed.
   You can delete the old database files or keep them locally or in another location as a backup.

If you encounter errors or warnings, open a new issue for [chainweb-node](https://github.com/kadena-io/chainweb-node#issues) or contact Kadena developers in the [infrastructure](https://discord.com/channels/502858632178958377/1051827506279370802) channel on the Kadena Discord server.