---
title: Prerequisite
description: Kadena makes blockchain work for everyone.
menu: KDA CLI
label: Prerequisite
order: 3
editLink: undefined/packages/tools/kda-cli/README.md
layout: full
---
# Prerequisite

In order to use this cli tool the following packages need to be installed
manually. In a later version some might be installed via the cli tool.

*   [node v16+ ](https://nodejs.org/en)
*   [docker ](https://docs.docker.com/get-docker/)

Login to docker with your [github account ](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) , use the *gh access token* as
password:

```sh
docker login ghcr.io -u <your gh username>
# or
echo $GITHUB_TOKEN | docker login ghcr.io --username <your gh username> --password-stdin
```
