---
title: kadena dapp
description:
  The `@kadena/kadena-cli` package provides a complete set of commands for creating applications and interacting with the Kadena network interactively or by using scripts from the command-line.
menu: Command-line interface
label: kadena dapp
order: 2
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# kadena dapp

Use `kadena dapp` to create new frontend applications.

## Basic usage

The basic syntax for the `kadena dapp` command is:

```bash
kadena dapp <action> [arguments] [flags]
```

## Actions

| Use this action | To do this    |
| --------------- | ------------- |
| add  | Create a new application project from a frontend framework template. |

## Flags

You can use the following optional flags with `kadena dapp` commands.

| Use this flag | To do this
| ------------- | -----------
| -h, --help |	Display usage information.
| -q, --quiet | Eliminate interactive prompts and confirmations to enable automation of tasks.
| -V, --version	| Display version information.
| --json | Format command results sent to standard output (stdout) using JSON format.
| --yaml | Format command results sent to standard output (stdout) using YAML format.

## kadena dapp add

Use `kadena dapp add` to create a new frontend application directory from a frontend framework template.
This command enables you to start a new project from the following commonly-used frontend frameworks:

- [Angular](https://angular.io/)
- [Nextjs]([18]: https://nextjs.org/)
- [Vuejs](https://vuejs.org/)

### Basic usage

The basic syntax for the `kadena dapp add ` command is:

```bash
kadena dapp add [arguments] [flags]
```

### Arguments

You can use the following command-line arguments with the `kadena dapp add` command:

| Use this argument | To do this |
| ----------------- | ------------------------------------------------- |
| project-directory | Specify the name of application project directory.
| -t, --dapp-template | Specify the type of project to create by selecting a frontend framework template. The valid templates are vuejs, nextjs, and angular. | 

### Examples

To create a new project called `my-to-do` using the Angular template, you can run a command similar to the following:

```bash
kadena dapp add --dapp-template="angular" my-to-do
```

This command prompts you to install missing required dependencies, if needed.
After you install any missing dependencies, you can change to the new project directory to see the template files and folders for an Angular project plus a `pact` folder with some starter code for a Pact module (`message-store.pact`) and for testing the Pact module in the Pact REPL (`message-store.repl`).
For example

```bash
ls -al my-to-do
   
drwxr-xr-x   15 pistolas  staff     480 May 16 12:50 .
drwxr-xr-x   27 pistolas  staff     864 May 16 12:49 ..
-rw-r--r--    1 pistolas  staff      82 May 16 12:49 .prettierignore
-rw-r--r--    1 pistolas  staff     315 May 16 12:49 .prettierrc.json
drwxr-xr-x    5 pistolas  staff     160 May 16 12:49 .vscode
-rw-r--r--    1 pistolas  staff     467 May 16 12:49 README.md
-rw-r--r--    1 pistolas  staff    2495 May 16 12:49 angular.json
drwxr-xr-x  688 pistolas  staff   22016 May 16 12:50 node_modules
-rw-r--r--    1 pistolas  staff  623198 May 16 12:50 package-lock.json
-rw-r--r--    1 pistolas  staff    1860 May 16 12:50 package.json
drwxr-xr-x    5 pistolas  staff     160 May 16 12:49 pact
drwxr-xr-x   10 pistolas  staff     320 May 16 12:49 src
-rw-r--r--    1 pistolas  staff     253 May 16 12:49 tsconfig.app.json
-rw-r--r--    1 pistolas  staff    1027 May 16 12:49 tsconfig.json
-rw-r--r--    1 pistolas  staff     285 May 16 12:49 tsconfig.spec.json
```
