---
title: Get started as a Chainweb operator
description: "Become a Chainweb node operator to support the Kadena network infrastructure."
menu: Deploy
label: Get started as a Chainweb operator
order: 1
layout: full
tags: [pact, chainweb, network, node operator, developer]
---

# Get started as a Chainweb node operator

Computers that run the Chainweb consensus protocol—by installing and managing the `chainweb-node` software—provide the resources that power the Kadena public blockchain network. 
By installing and running `chainweb-node` and connecting to the Kadena testnet or mainnet network, you can extend the peer-to-peer communication infrastructure and have direct access to the blockchain state.
You can help improve and security and scalability of the network just by participating.
You can also earn rewards if you choose to add resources to calculate proof-of-work solutions to validate transactions as a miner. 

## Minimum system requirements

Before installing Chainweb, you should verify that your computer meets the following minimum recommended hardware requirements for running a node:

- CPU: Minimum of two (2) CPU cores.
- RAM: Minimum of four (4) GB of RAM.
- Storage: Minimum 250 GB using a solid state drive (SSD) or fast hard disk drive (HDD).
- Network: Publicly-accessible IP address.
- Operating system: Linux AMD64 architecture.

If you also plan to use the node as an API server for Pact calls or for mining, exchange integration, or accessing indexed data, you should verify that your computer meets the following minimum recommended hardware requirements: 

- Four (4) CPU cores.
- Eight (8) GB of RAM.

### Operating system architecture

It's possible to run a Chainweb node on Linux or macOS with ARM64 architecture.
However, you must build the binaries yourself and you might experience some unexpected behavior when running a node on ARM64 architecture.
If you want to run a Chainweb node on Microsoft Windows, you should install the latest Windows Services for Linux (WSL) software.
You can then install the `chainweb-node` software in the WSL virtual environment rather than using the native Windows operating system. 

### Incoming and outgoing network rules

In addition to a publicly-accessible IP address, nodes must be able to communicate with peers and accept incoming messages from other computers in the network.
If your computer is behind a firewall or is a virtual guest connecting to the internet through a host computer, you should review your network configuration and open required ports to allow inbound and outbound traffic. 
For example, you might need to configure port forwarding for port 1789 to allow inbound connections from remote nodes.

## Installation options

There are several options for setting up a Chainweb node in a physical or virtual environment.
For example, you can run a Chainweb node image in a Docker container or build the binaries directly from the source code.
You can install release binaries directly on a physical Linux server or run them using the infrastructure from a cloud services provider.

For more information about your installation options, see the following topics:

- [Install release binaries]()
- [Run in a Docker container]()
- [Build from source code]()

## Install release binaries

You can download compressed archive files with `chainweb-node` release binaries for Ubuntu Linux directly from the [Releases](https://github.com/kadena-io/chainweb-node/releases) pages in the [chainweb-node](https://github.com/kadena-io/chainweb-node/) repository.
If you have Ubuntu 20.0.4 or Ubuntu 22.04 on a physical or virtual machine, downloading the binary is the most straightforward installation path.

To install from a release archive:

1. Open a terminal shell on the physical or virtual host with the Ubuntu Linux operating system.

2. Update the system with the latest software by running the following command:
   
   ```bash
   sudo apt update && sudo apt upgrade
   ```

3. Install the required packages by running the following command:
   
   ```bash
   sudo apt-get install ca-certificates libgmp10 libssl3 libsnappy1v5 zlib1g liblz4-1 libbz2-1.0 libgflags2.2 zstd
   ```

   Note that Ubuntu 20.04 requires the `libssl1.1` package instead of the `libssl3` package. 
   This package has been deprecated in Ubuntu 22.04.
   If your computer uses the Ubuntu 20.04 operating system, install the `libssl1.1` package instead of the `libssl3` package. 

4. Download the archive file from the [Releases](https://github.com/kadena-io/chainweb-node/releases) page.
   
   Note that the archive file naming convention includes the `chainweb-node` version, compiler version, Ubuntu version, and a commit hash identifier using the following format:
   
   ```text
   chainweb-<version>.ghc-<version>.ubuntu-<version>.<revision>.tar.gz
   ```
   
   For example, the `chainweb-node` archive file for Ubuntu 22.04 looks like this:
   
   ```text
   chainweb-2.24.1.ghc-9.6.5.ubuntu-22.04.89b0ac3.tar.gz
   ```

5. Change to the directory that contains the downloaded file—typically, the Downloads folder—or move the file to a new location.

6. Unzip the compressed archive by running a command similar to the following:
   
   ```bash
   gunzip chainweb-2.24.1.ghc-9.6.5.ubuntu-22.04.89b0ac3.tar.gz
   ```

7. Extract the archive by running a command similar to the following:
   
   ```bash
   tar -xvf chainweb-2.24.1.ghc-9.6.5.ubuntu-22.04.89b0ac3.tar
   ```

8. Verify the binary is ready to use and review command-line options by running the following command:
   
   ```bash
   ./chainweb-node --help
   ```

9. Review the default configuration settings for the node by running the following command:
      
   ```bash
   ./chainweb-node --print-config
   ```

10. Extract the default configuration settings to create a configuration file for the node by running the following command:
   
   ```bash
   ./chainweb-node --print-config > node-config.yaml
   ```

   After you've created the configuration file, you can edit settings in the file or use corresponding command-line options to control node operations.
   For more information about editing configuration settings in the configuration file, see [Edit the configuration settings]().
   For information about using command-line options to control node operations, see thr [chainweb-node]() command-line reference.

## Run in a Docker container

If you have Docker installed, you can download a `chainweb-node` image and run a node in a Docker container.

To run a node in a container:

1. Open a terminal shell on the physical or virtual host where you have Docker installed.

2. Verify that Docker is installed and the `docker` process is running with the following command:
   
   ```bash
   docker --version
   ```

   This commands should return information similar to the following:

   ```bash
   Docker version 24.0.6, build ed223bc
   ```

1. Pull the latest image and review command-line options by running the following command:
   
   ```bash
   docker run --publish 1789:1789 --publish 80:80 --entrypoint=chainweb/chainweb-node ghrc.io/kadena-io/chainweb-node/ubuntu:latest --help
   ```

9. Review the default configuration settings for the node by running the following command:
      
   ```bash
   docker run --publish 1789:1789 --publish 80:80 --entrypoint=chainweb/chainweb-node ghrc.io/kadena-io/chainweb-node/ubuntu:latest --print-config
   ```

10. Extract the default configuration settings to create a configuration file for the node by running the following command:
   
   ```bash
   docker run --publish 1789:1789 --publish 80:80 --entrypoint=chainweb/chainweb-node ghrc.io/kadena-io/chainweb-node/ubuntu:latest --print-config > node-config.yaml
   ```

## Build from source



## Edit the configuration settings

After you create a node configuration file from the default settings, you can edit the configuration to suit your environment.
For example, you can edit the configuration file to make the following types of changes:

- Enable the backup API and specify the directory for backup files.
- Connect the node to the Kadena test network instead of the Kadena main network.
- Specify a directory for blockchain database files.

To edit the node configuration:

1. Open a terminal shell on a computer with access to the node configuration file.
2. Copy the default configuration file to save as a backup.
   
   For example, copy the `node-config.yaml` to save it as the `default-config.yaml` file:

   ```bash
   cp node-config.yaml default-config.yaml
   ```

3. Open the configuration file in a text editor and edit the settings you want to change.
   
   For example, the following excerpt illustrates some common changes:

   ```yaml
   chainweb:
     allowReadsInLocal: false
     backup:
       api:
         configuration: {}
         enabled: true
       directory: /tmp/my-backups
     chainwebVersion: testnet04
     
     fullHistoricPactState: false
     
     databaseDirectory: /usr/local/share
   ```

## Start the Chainweb node

After you've made any changes needed in the node configuration file, you can start the node with the modified configuration file.

To start the node from the release binary or after building from the source, you can run a command similar to the following:

```bash
./chainweb-node --config-file node-config-updated.yaml   
```

To start the node in a Docker container:
   
```bash
   
```