<!-- genericHeader start -->

# @kadena/kda-cli

CLI tool to assist development on the kadena blockchain

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

## Prerequisite

In order to use this cli tool the following packages need to be installed
manually. In a later version some might be installed via the cli tool.

- [node v16+][1]
- [docker][2]

Login to docker with your [github account][3] , use the _gh access token_ as
password:

```sh
docker login ghcr.io -u <your gh username>
# or
echo $GITHUB_TOKEN | docker login ghcr.io --username <your gh username> --password-stdin
```

## Install

Note that the package is not yet published, so for now you need to clone this
repo and make a symlink.

```sh
$ npm install --global @kadena/kda-cli
```

### Install From repo

To install the executable from this repo:

```sh
pnpm install
pnpm build --filter @kadena/kda-cli
# if you are using NVM, you should have this environment variable available
ln -s $(pwd)/bin/kda.js $NVM_BIN/kda
# if not, you can replace $NVM_BIN to any path you have added in your $PATH
```

## CLI

```sh
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

![image][4]

![image][5]

Then add the account(s) you've funded:

![image][6]

## Devnet

The current version of devnet is hard coded to target `fast-devnet`. This branch
has some optimizations in place to target the L2 development. In a later version
this will become configurable.

## NOTE

The `pact.ts` mini lib has been added as both an experiment to test out a
functional approach for kadena.js, as well as a means to provide for
`continuation` requests. Please note that once `kadena.js` supports continuation
requests, this package will be refactored to use our lib instead.

[1]: https://nodejs.org/en
[2]: https://docs.docker.com/get-docker/
[3]:
  https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
[4]:
  https://github.com/kadena-community/kadena.js/assets/1508400/41896656-e660-4814-b3bb-c4d68278a61d
[5]:
  https://github.com/kadena-community/kadena.js/assets/1508400/91dc0b3b-388c-4e59-9401-4f80ce2bdaf9
[6]:
  https://github.com/kadena-community/kadena.js/assets/1508400/b15c7d1b-0c4e-474e-bf75-10a569b003ae
