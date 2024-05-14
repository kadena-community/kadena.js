---
title: kadena dapp
description:
  The `@kadena/kadena-cli` library provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena dapp
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena dapp

Use `kadena dapp` to create new application project directories.

## Basic usage

## Actions

| Use this action | To do this    |
| --------------- | ------------- |
| add            | add a new Dapp project |


## kadena dapp add

### Arguments

| Use this argument | To do this  | **Required** |
| ----------------- | ----------------------------------------- | ------------ |
| project-directory | Specify the project directory \[Required] | yes          |

| **Options**     | **Description**                         | **Required** |
| --------------- | --------------------------------------- | ------------ |
| --dapp-template | Select template: vuejs, nextjs, angular | Yes          |

### Examples

```
kadena dapp add --dapp-template="vuejs" kadena-dapp
```

### Supported templates

It supports a number of well known and widely used frameworks to choose from
when starting a new project. The following project templates are currently
available:

- [Nextjs][18]
- [Vuejs][19]
- [Angular][20]

[18]: https://nextjs.org/
[19]: https://vuejs.org/
[20]: https://angular.io/