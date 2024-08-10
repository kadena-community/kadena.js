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
For example, you might need to configure port forwarding for port 1789 on your router or host computer to allow inbound connections from remote nodes.

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

8. Verify the binary is ready to use and review command-line configuration options by running the following command:
   
   ```bash
   ./chainweb-node --help
   ```

   You should see usage information about the configuration settings you can specify as command-line options similar to the following truncated output:

   ```bash
   Usage: chainweb-node [--info] [--long-info] [-v|--version] [--license] 
                        [-?|-h|--help] 
                        [--print-config-as full|minimal|diff | --print-config] 
                        [--config-file FILE] 
   ```

      From the usage information, you can see that there are a large number of configuration options that you can use to control and operation and behavior of the Chainweb node. 
      Before you start the node, you should review the configuration options and the default values to determine whether you want to make any changes to the configuration of the node.
      For information about this next step, see [Review the default configuration](#review-the-default-configuration).

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

3. Pull the latest image by running the following command:
   
   ```bash
   docker pull ghcr.io/kadena-io/chainweb-node/ubuntu:latest
   ```

1. Verify the binary is ready to use and review command-line configuration options by running the following command:
   
   ```bash
   docker run --publish 1789:1789 --publish 1848:1848 --entrypoint=/chainweb/chainweb-node ghcr.io/kadena-io/chainweb-node/ubuntu:latest --help
   ```

   You should see usage information about the configuration settings you can specify as command-line options similar to the following truncated output:

   ```bash
   Usage: chainweb-node [--info] [--long-info] [-v|--version] [--license] 
                        [-?|-h|--help] 
                        [--print-config-as full|minimal|diff | --print-config] 
                        [--config-file FILE] 
   ```

      From the usage information, you can see that there are a large number of configuration options that you can use to control and operation and behavior of the Chainweb node. 
      Before you start the node, you should review the configuration options and the default values to determine whether you want to make any changes to the configuration of the node.
      For information about this next step, see [Review the default configuration](#review-the-default-configuration).

## Build from source

In most cases, you should run Chainweb nodes using officially released `chainweb-node` binaries or from the binary packaged in officially released Docker images that you can download from the [Releases](https://github.com/kadena-io/chainweb-node/releases) page. 
However, if you choose to build the chainweb-node binary yourself, you should first ensure that you have an officially released and tagged version of the source code. 
Tagged versions of the source code are tested extensively to ensure that they are compatible with all nodes in the Chainweb network.

You shouldn't build `chainweb-node` from the `master` branch if you plan to run the node as part of a Kadena public network.

To download tagged source code:

1. Open the [Releases](https://github.com/kadena-io/chainweb-node/releases) page.

2. Download the compressed archive for your working environment:

   ![Download source code](/assets/docs/chainweb-node-assets)

3. Unzip the compressed archive double-clicking or by running commands similar to the following:

   ```bash
   gunzip chainweb-node-2.24.1.tar.gz
   tar -xvf chainweb-node-2.24.1.tar
   ```

1. Change to the `chainweb-node` source code directory. 

After you have downloaded and unpacked the source code, you have two options for building the `chainweb-node` binary from the source:

- You can build the binary using the native Haskell toolchain.
- You can build the binary using the Nix package manager.

### Build with Haskell

To build with the native Haskell toolchain:

1. Download and install the following Haskell tools:
   
   - [Glasgow Haskell Compiler (GHC)](https://www.haskell.org/ghc/), `ghc-9.6.5`, or later.
   - [Haskell build tool CABAL](https://www.haskell.org/cabal/), `cabal`, version 3.4, or later.

   You can download, install and manage the Haskell toolchain using `ghcup`.
   To install on Linux, macOS, FreeBSD, or WSL2, go to [GCHCup](https://www.haskell.org/ghcup/) to download the main Haskell installer, then follow the installation instructions to install the toolchain.

1. Install the development versions of the following required libraries: 

   - gflags-dev 
   - snappy-dev 
   - zlib-dev
   - lz4-dev
   - bz2-dev
   - zstd-dev

   If the host uses the advance package tool (apt), you can install these libraries by running the following command:
   
   ```bash
   apt-get install ca-certificates libssl-dev libgmp-dev libsnappy-dev zlib1g-dev liblz4-dev libbz2-dev libgflags-dev libzstd-dev
   ```

   On macOS, you can install these libraries by running the following command:
   
   ```bash
   brew install ca-certificates libgmp-dev libsnappy-dev zlib1g-dev liblz4-dev libbz2-dev libgflags-dev libzstd-dev
   ```

1. Build a `chainweb-node` binary by running the following command:
   
   ```bash
   cabal build
   ```

1. Locate the `chainweb-node` executable binary by running the following command:
   
   ```bash
   cabal list-bin chainweb-node
   ```

8. Verify that `chainweb-node` is ready to use and review command-line configuration options by running the following command:
   
   ```bash
   ./chainweb-node --help
   ```

   You should see usage information about the configuration settings you can specify as command-line options similar to the following truncated output:

   ```bash
   Usage: chainweb-node [--info] [--long-info] [-v|--version] [--license] 
                        [-?|-h|--help] 
                        [--print-config-as full|minimal|diff | --print-config] 
                        [--config-file FILE] 
   ```

   From the usage information, you can see that there are a large number of configuration options that you can use to control and operation and behavior of the Chainweb node. 
   Before you start the node, you should review the configuration options and the default values to determine whether you want to make any changes to the configuration of the node.
   For information about this next step, see [Review the default configuration](#review-the-default-configuration).

### Build with Nix

One advantage of using the Nix package manager to build and run the chainweb-node binary is that Nix caches binary dependencies, so you can download pre-built binaries for for the libraries and packages that Chainweb requires.

To build with the Nix package manager:

1. Download and install [Nix](https://nixos.org/nix/) by clicking **Get Nix**, then follow the instructions.

1. Open your shell startup profile file for the shell you use in a text editor.
   
   For example, if you are using the `bash` shell, open the `.bash_profile` file.
   If you are using the `zsh` shell, open the `.zsh_profile` file.

1. Add the following line to the startup profile:

   ```text
   . $HOME/.nix-profile/etc/profile.d/nix.sh
   ```

   If you don't want to edit the profile directly using a text editor or don't have a text editor installed, you can run a command similar to the following:
   
   ```bash
   echo ". $HOME/.nix-profile/etc/profile.d/nix.sh" >> ~/.bash_profile
   ```
   
   If you are using a different shell, change `.bash_profile` to the appropriate startup script for your shell.

1. Open the `/etc/nix/nix.conf` file in a text editor and add the following lines to the file:

   ```text
   substituters = https://nixcache.chainweb.com https://cache.nixos.org/
   trusted-public-keys = nixcache.chainweb.com:FVN503ABX9F8x8K0ptnc99XEz5SaA4Sks6kNcZn2pBY= cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY=
   experimental-features = nix-command flakes
   ```

   If the `/etc/nix` directory doesn't exist, you should switch to the root user and create it, then add the `nix.conf` file to the directory.

2. Restart the nix-daemon.
   
   Most installations of Nix are multi-user and require you to restart the nix daemon to make your `nix.conf` changes take effect. 
   
   You can check whether Nix is running in multi-user or single-user mode by running the following command:
   
   ```bash
   ps aux | grep nix-daemon
   ```
   
   If you see only the `grep` command, then you are using single-user mode and you don't have to do anything else. 
   If you see a `nix-daemon` process, then you are using multi-user mode and you need to restart the process
   
   On macOS, run the following commands:
   
   ```bash
   sudo launchctl stop org.nixos.nix-daemon
   sudo launchctl start org.nixos.nix-daemon
   ```
   
   On Linux, run the following command:
   
   ```bash
   sudo systemctl restart nix-daemon.service
   ```

1. Change to the directory that contains the source code for the `chainweb-node` binary.
   
2. Build `chainweb-node` by running the following command in the project directory:

   ```bash
   nix-build
   ```
   
   After starting the build, you should see messages similar to the following:
   
   ```text
   copying path '/nix/store/8dyrf48cwvyqhvks5adxlk675qgm7pql-haskell-project-plan-to-nix-pkgs' from 'https://nixcache.chainweb.com'...
   ```
   
   These messages indicate that the pre-built artifacts are being successfully downloaded from the cache. 
   
   When the build is finished, the directory with the `chainweb-node` source code contains a `result` subdirectory with a symbolic link to the Nix cache.

3. Verify that `chainweb-node` is ready to use and review command-line configuration options by running the following command:
   
   ```bash
   ./result/bin/chainweb-node --help
   ```

   You should see usage information about the configuration settings you can specify as command-line options similar to the following truncated output:

   ```bash
   Usage: chainweb-node [--info] [--long-info] [-v|--version] [--license] 
                        [-?|-h|--help] 
                        [--print-config-as full|minimal|diff | --print-config] 
                        [--config-file FILE] 
   ```

   From the usage information, you can see that there are a large number of configuration options that you can use to control and operation and behavior of the Chainweb node. 
   Before you start the node, you should review the configuration options and the default values to determine whether you want to make any changes to the configuration of the node.
   For information about this next step, see [Review the default configuration](#review-the-default-configuration).

## Review the default configuration

Now that you have a Chainweb node binary ready to run, you should review the default configuration options and the default values. 
Configuration options and settings control many types of node behavior, operation, and features.
For example, you can use configuration options to enable or disable telemetry for the node.
You can also modify configuration settings to change the logging level for node messages.

To review the default node configuration:

1. Open a terminal shell on a computer with access to the `chainweb-node` binary.

2. Change to the directory that contains the `chainweb-node` binary.
   
3. View the default configuration settings in the terminal by running the following command:
      
   ```bash
   ./chainweb-node --print-config
   ```

   If you're running the node in a Docker container, you can view the configuration settings by running the following command:
      
   ```bash
   docker run --publish 1789:1789 --publish 1848:1848 --entrypoint=/chainweb/chainweb-node ghcr.io/kadena-io/chainweb-node/ubuntu:latest --print-config
   ```

5. Extract the default configuration settings to create a configuration file for the node by running the following command:
   
   ```bash
   ./chainweb-node --print-config > node-config.yaml
   ```

   If you're running the node in a Docker container, you can create a configuration file for the node by running the following command:
   
   ```bash
   docker run --publish 1789:1789 --publish 1848:1848 --entrypoint=chainweb/chainweb-node ghcr.io/kadena-io/chainweb-node/ubuntu:latest --print-config > node-config.yaml
   ```
   
   However, this command creates the configuration file in the host environment instead of the container.

   After you create a node configuration file from the default settings, you should determine whether you want to make any changes to the configuration of the node.
   
   If you want to modify the configuration of the node or add features that are disabled by default, you can:

   - Edit settings in one or more configuration files.
   - Use corresponding command-line options to control node operations.
   
   For more information about editing configuration settings in the configuration file, see [Edit the configuration settings](#edit-the-configuration-settings).
   For information about using command-line options to control node operations, see thr [chainweb-node]() command-line reference.

## Edit the configuration settings

After you create a node configuration file from the default settings, you can edit the configuration to suit your environment.
For example, you can edit the configuration file to make the following types of changes:

- Enable the backup API and specify the directory for backup files.
- Connect the node to the Kadena test network instead of the Kadena main network.
- Specify a directory for blockchain database files.
- Ignore or connect to a subset of [bootstrap nodes]().

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

To start the node in a Docker container, you can run a command similar to the following to use the default configuration settings:
   
```bash
docker run -p 1789:1789 -p 1848:1848 --entrypoint=/chainweb/chainweb-node ghcr.io/kadena-io/chainweb-node:ubuntu:latest   
```

If you want to run the node with modified configuration settings, you can add the appropriate command-line options when starting the node.
For example:

```bash
docker run -p 1789:1789 -p 1848:1848 --entrypoint=/chainweb/chainweb-node ghcr.io/kadena-io/chainweb-node:ubuntu:latest --enable-backup-api --backup-directory /tmp/my-backups
```