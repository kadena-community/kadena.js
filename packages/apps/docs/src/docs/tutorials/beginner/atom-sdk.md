---
title: Atom SDK
description:
  The goal of this tutorial is to get you up and running with the Pact
  environment and the Pact Atom SDK to begin running Pact programs locally.
menu: Atom SDK
label: Atom SDK
order: 8
layout: full
tags: ['pact', 'atom sdk', 'pact installation', 'local development']
---

# Atom SDK

Welcome to this tutorial on Pact Development on Atom SDK!

**Topics covered in this tutorial**

- Pact in Atom SDK Overview
- Install the Pact Programming Language
- Install Atom
- Install the Atom language-pact package
- Run Code Locally

The goal of this tutorial is to get you up and running with the Pact environment
and the Pact Atom SDK to begin running Pact programs locally.

:::note Key Takeaway

Pact and the Atom SDK provide a powerful development environment that allows you
to run Pact programs locally.

:::

## Pact Development on Atom SDK Tutorial

Getting started with Pact on your local device allows you to work in a powerful
development environment to run your smart contracts locally. This environment
can be set up on Mac and Linux operating systems.

:::caution Windows

Because Pact is non-trivial to build on Windows it is not available for download
as an executable. If you need to work from Windows consider using a virtual
machine or WSL:
[dev.to/darksmile92/linux-on-windows-wsl-with-desktop-environment-via-rdp](https://dev.to/darksmile92/linux-on-windows-wsl-with-desktop-environment-via-rdp-522g).
More instructions on installing Pact can be found on the
[GitHub](https://github.com/kadena-io/pact) page.

:::

### Install Pact

To get started with Pact you’ll first need to install the Pact programming
language. Next we go over the steps with
[Mac](/build/pact/atom-sdk#installing-pact-mac) and Linux to get it installed
on your local computer.

#### Installing Pact Linux

Instructions tested with Ubuntu LTS but should work for many distributions with
minor modifications.

```
sudo apt install z3 unzip git
```

Download the latest Pact build from
[github.com/kadena-io/pact/releases](https://github.com/kadena-io/pact/releases).
Assuming you have the zip in the folder Downloads :

```bash title=" "
cd ~/Downloads
```

```bash title=" "
unzip pact-4*
```

```bash title=" "
mkdir ~/bin && mv pact ~/bin
```

```bash title=" "
chmod +x ~/bin/pact
```

To test if the installation was successful open a new terminal and run `pact`.

```bash title=" "
pact
pact> (+ "hello " "world")
"hello world"
pact>
```

Press ctrl-d to exit the Pact prompt.

#### Installing Pact Mac

https://www.youtube.com/watch?v=J-GuviTE3qo

The easiest way to do this for Mac is by using Homebrew. If you have Homebrew
continue to
[installing Pact language with Homebrew](/build/pact/atom-sdk#installing-pact-with-homebrew).

##### Homebrew

If you don’t have Homebrew, you’ll need to get that first. To find instructions
for this go to [brew.sh](https://brew.sh/).

This is a popular package manager used to install many packages for Mac. If
you’re just getting started with it I’m sure you’ll also find it valuable in the
future.

![1-home-brew](/assets/docs/1-home-brew.png)

To install Homebrew, copy the command provided on the center of the screen and
run it in your terminal window.

![2-install-homebrew](/assets/docs/2-install-homebrew.png)

After a few moments you’ll have Homebrew installed on your computer. To verify
your installation type `brew --version`.

This should return the current version of your installation.

##### Installing Pact with Homebrew

Now that you have Homebrew, you can use it to install the Pact language. You’ll
do this with the following command.

```bash title=" "
brew install kadena-io/pact/pact
```

To check the installation go to your terminal and type Pact.

This should open up the Pact environment. You can run any commands available in
Pact from this environment.

For example, typing ( + 1 2 ) will add these 2 numbers and return a value of 3.

![3-run-pact](/assets/docs/3-run-pact.png)

You can find other commands in the documentation and we’ll go over many of these
throughout other tutorials.

### Atom SDK

The terminal is helpful, but you’ll often want to create larger programs from
within your editor.

The best way to write smart contracts locally is by using the Atom editor. Pact
provides Atom integration giving you syntax highlighting, continuous integration
with a directory, .repl scripts, and errors/warnings linting.

To install the Atom editor, navigate to [atom.io](https://atom.io/) and select
**download**.

From there, follow the installation instructions to get up and running with
Atom.

![4-atom](/assets/docs/4-atom.png)

### Language-pact Package

To install the language-pact package, open **Atom**, go to Atom in the menu and
select **preferences**. From within preferences select **install** and type
**language-pact**.

Once you do this you should see the package appear. Click **install** to install
this package.

At this point Atom is set up to run the Pact programming language.

### Hello World from your Local Environment

Before wrapping up, try running your first Hello World smart contract in Atom.

To do this, open your terminal and navigate into whichever folder you would like
as a project directory.

```bash title=" "
cd Desktop
```

Next, clone the pact examples GitHub repository found
[here](https://github.com/kadena-io/pact-examples).

```bash title=" "
git clone https://github.com/kadena-io/pact-examples
```

This clones a directory with many Pact examples. For now, navigate to the Hello
World example.

```bash title=" "
cd pact-examples/hello-world
```

From within this folder, open the Pact terminal.

```bash title=" "
pact
pact>
```

Using the Pact terminal, run the **hello-world.repl** file.

```bash title=" "
(load "hello-world.repl")
```

:::info

The .repl file loads the smart contract from the .pact file to run the code.
This file contains the code behind the **Load into REPL** feature that has so
far been available automatically from the online editor allowing you to run code
locally. The contents of this .repl file are explained in more detail in the
next tutorial.

:::

After running this file, you should see the following output to your terminal.

```bash title=" "
"Loading hello-world.repl..."
"Setting transaction data"
"Setting transaction keys"
""
""
"Loading hello-world.pact..."
"Keyset defined"
"Loaded module \"hello\", hash \"a493bb7d096c786891bde5d2125c5acbdcd769ba68c50d38691d173b3b7c03ee85cfcde2db34afb0c6c20c5cde3433ab129829ae4283ed789bd7a9d40837fe88\""
"TableCreated"
"Write succeeded"
"Hello, world!"
""
""
"Hello, world!"
```

Receiving this message means that you have run the code correctly!

You can check the contents of this smart contract by opening it in Atom.

First, exit the Pact terminal (or open a new terminal in this directory)

- Press **Control + D** to exit the Pact terminal.
- Enter **atom .** to open the directory in Atom.

Look through the code provided to better understand the contents of this smart
contract.

![5-hello-world](/assets/docs/5-hello-world.png)

It is slightly different than the hello world smart contract you had seen
previously in the online editor. As you’ll see, it stores the value in a table
and then returns that value using some of the Pact built-in functions you
learned in previous tutorials.

## Review

That wraps up this tutorial. The goal of this tutorial was to get you up and
running with Pact on the Atom SDK.

In this tutorial, you got started with Pact locally. You installed Homebrew,
Atom, the language-pact package, and the Pact language. You also ran your first
hello-world Pact program on your local computer.

Depending on your needs, you can now use both the online editor and the Atom
editor to create Pact programs.
