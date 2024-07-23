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
The `compact` command enables you to delete historical unused state from the `chainweb-node` chain RocksDB database and the Pact SQLite database.
Removing old state that isn't required to validate transactions or reach consensus enables your node to use far less disk space overall while maintaining the semantic integrity of node operations.

After you compact the state and restart the node to use the compacted database, you can delete the old database to further reduce your storage overhead or save the old database in another location as a backup.

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
   Pact DB Compaction Tool - create a compacted copy of the source database directory Pact DB into the target directory.
   
   chainweb-version 
   --from Directory containing SQLite Pact state and RocksDB block data to compact (expected to be in $DIR/0/{sqlite,rocksDb}
   
   --to Directory where to place the compacted Pact state and block data. It will place them in $DIR/0/{sqlite,rocksDb}, respectively.
   --parallel Turn on multi-threaded compaction. The threads are per-chain.
   --log-dir Directory where compaction logs will be placed.

   Usage: cwtool COMMAND

   Available options:
     -h,--help                Show this help text
   ```

3. Compact your `rocksdb` and `sqlite` databases by running the `compact` command with the following arguments:

   - `--from` to specify the path to the current database.
   - `--to` to specify the path to the compacted state.
   - `--log-dir` to specify the directory where you want the `compact` program to put the log files it creates, one for each chain. If the directory doesn’t exist, the `compact` program creates it. These logs can be useful for debugging if something goes wrong.
   - `--chainweb-version` to specify the network identifier for the node. This argument is optional if you're compacting a database for the `mainnet01` network. If you're compacting a database for another network—for example, the Kadena test network—you must specify the network identifier. Valid values are "`development`", "`testnet04`", and "`mainnet01`".

   For example, if you have navigated to the `data/state/chainweb` directory, run a command similar to the following:

   ```bash
   compact --from db --to compact-testnet-db --log-dir /tmp/compact-db-logs --chainweb-version testnet04
   ```

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
   You can delete the old database files or keep them locally or in another location as a backup

If you encounter errors or warnings, open a new issue for [chainweb-node](https://github.com/kadena-io/chainweb-node#issues) or contact Kadena developers in the [infrastructure](https://discord.com/channels/502858632178958377/1051827506279370802) channel on the Kadena Discord server.