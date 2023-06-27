# kda-cli

This cli tool is here to assist you with your development on the kadena
blockchain.

## Prerequisite

In order to use this cli tool the following packages need to be installed
manually. In a later version some might be installed via the cli tool.

- [node v16+](https://nodejs.org/en)
- [docker](https://docs.docker.com/get-docker/)

Login to docker with your
[github account](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
, use the _gh access token_ as password:

```
docker login ghcr.io -u <your gh username>
# or
echo $GITHUB_TOKEN | docker login ghcr.io --username <your gh username> --password-stdin
```

## Install

Note that the package is not yet published, so for now you need to clone this
repo and make a symlink.

```bash
$ npm install --global @kadena/kda-cli
```

### Install From repo

To install the executable from this repo:

```bash
rush install --to @kadena/kda-cli
rush build --to @kadena/kda-cli
chmod +x ./lib/index.js
# if you are using NVM, you should have this environment variable available
ln -s $(pwd)/lib/index.js $NVM_BIN/kda
# if not, you can replace $NVM_BIN to any path you have added in your $PATH
```

## CLI

```bash
$ kda --help

  Usage
    $ kda

  Options
    --task  Task

  Examples
    $ kda --task=rerun
    $ kda --task=start
    $ kda --task=stop
    $ kda --task=fund
    $ kda --task=deploy
    $ kda --task=local
```

## Chainweaver

To setup your devnet (L1 and L2) you can configure chainweaver as such:

![image](https://github.com/kadena-community/kadena.js/assets/1508400/41896656-e660-4814-b3bb-c4d68278a61d)
![image](https://github.com/kadena-community/kadena.js/assets/1508400/91dc0b3b-388c-4e59-9401-4f80ce2bdaf9)

Then add the account(s) you've funded:
![image](https://github.com/kadena-community/kadena.js/assets/1508400/b15c7d1b-0c4e-474e-bf75-10a569b003ae)

## Devnet

The current version of devnet is hard coded to target `fast-devnet`. This branch
has some optimizations in place to target the L2 development. In a later version
this will become configurable.

## NOTE

The `pact.ts` mini lib has been added as both an experiment to test out a
functional approach for kadena.js, as well as a means to provide for
`continuation` requests. Please note that once `kadena.js` supports continuation
requests, this package will be refactored to use our lib instead.
