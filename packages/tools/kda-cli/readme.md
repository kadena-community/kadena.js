# kda-cli

This cli tool is here to assist you with your development on the kadena blockchain.

## Prerequisite

In order to use this cli tool the following packages need to be installed manually.
In a later version some might be installed via the cli tool.

- [node v16+](https://nodejs.org/en)
- [docker](https://docs.docker.com/get-docker/)

## Install

Note that the package is not yet published, so for now you need to clone this
repo and make a symlink.

```bash
$ npm install --global kda-cli
```

## CLI

```
$ kda-cli --help

  Usage
    $ kda-cli

  Options
    --task  Your task

  Examples
    $ kda-cli --task=rerun
```
