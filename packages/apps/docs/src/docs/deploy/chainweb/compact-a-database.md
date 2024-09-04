---

title: Compact Chainweb node databases
description: "Reduce the storage required by the Chainweb node databases."
menu: Deploy
label: Compact Chainweb databases
order: 2
layout: full
tags: [pact, chainweb, network, node operator, developer]

---
# Compact Chainweb node databases

Because a healthy blockchain continuously adds new transactions in new blocks that change the state of the database, managing the storage requirements on individual nodes can be challenging.

To address this storage issue, Chainweb provides the `compact` command-line program.
The `compact` program enables you to delete historical unused state from the `chainweb-node` RocksDB database and the Pact SQLite database.
Removing old state that isn't required to validate transactions or reach consensus enables your node to use far less disk space overall while maintaining the semantic integrity of node operations.

Note that, if possible, you should run the `compact` program on a computer or instance with higher input/output operations per second (IOPS). 
For nodes that run as virtual machines or instances on a cloud platform, you can typically configure this setting to optimize performance.

After you compact the state and restart the node to use the compacted database, you can delete the old database to further reduce your storage overhead or save the old database in another location as a backup.

To reduce storage for Chainweb node databases:

1. Open a terminal shell on a computer with access to the `chainweb-node` you manage.

   For example, if you run the node in a Docker container, open a terminal in the container.
   If you installed `chainweb-node` from a release binary or built it from source, open a terminal or secure shell on the computer where the binary is installed.

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

   For example, if you are using the default location for the database directory and a node connected to the Kadena test network, run a command similar to the following:

   ```bash
   compact --from ~/.local/share/chainweb-node/testnet04 --to ~/.local/share/chainweb-node/compact-db --log-dir /tmp/compaction-log-files --chainweb-version testnet04
   ```

   Note that the location of the Chainweb root database directory—`~/.local/share/chainweb-node/testnet04` in this example—depends on the configuration of the node.
   If you haven't specified a location in the configuration file, the default location is `~/.local/share/chainweb-node/{chainweb-network-id}`, for example `~/.local/share/chainweb-node/testnet04` for a node in the Kadena test network.

   If your node isn't synchronized with the current block height of the network or doesn't have enough history to ensure proper validation, you might see the `compact` operation fail with any error similar to the following:

   ```bash
   2024-08-09T20:03:38.215Z [Error] [] locateLatestSafeTarget: Not enough history to safely compact. Aborting.
   ```

   If you have enough history for compaction to succeed, you should see a message in the terminal similar to the following:

   ```text
   2024-08-13T18:11:30.991Z [Debug] [] Latest Common BlockHeight: 4115162
   2024-08-13T18:11:30.991Z [Debug] [] Earliest Common BlockHeight: 332604
   2024-08-13T18:11:31.438Z [Debug] [] Compaction target blockheight is: 4114162
   2024-08-13T18:11:31.438Z [Debug] [] targetBlockHeight: 4114162
   ```

   All other messages are recorded in the log files in the directory you specified for the `--log-dir` command-line argument.

4. Stop your node.

5. Restart your node with the new compacted database directory.
   
   You can specify the new compacted database directory as a command-line option or edit the node configuration file you use to set the new compacted database directory.

   For example, you can restart the node with a command similar to the following:

   ```bash
   chainweb-node --database-directory=~/.local/share/chainweb-node/compact-db
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
     databaseDirectory: ~/.local/share/chainweb-node/compact-db
   ```

   After you restart the node, it should run normally with the reduced database size as though nothing has changed.
   You can delete the old database files or keep them locally or in another location as a backup.

If you encounter errors or warnings, open a new issue for [chainweb-node](https://github.com/kadena-io/chainweb-node#issues) or contact Kadena developers in the [infrastructure](https://discord.com/channels/502858632178958377/1051827506279370802) channel on the Kadena Discord server.