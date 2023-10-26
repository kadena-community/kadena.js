---
title: Building with Nix
description:
menu: Building with Nix
label: Building with Nix
order: 6
layout: full
tags: ['pact', 'nix', 'intermediate', 'pact tutorials']
---

# Building With Nix

## Start with Nix

Go to https://nixos.org/nix/, click the "Get Nix" link, and follow the
instructions.

When this is finished, you need to add the following line to your shell startup
file:

```bash
. $HOME/.nix-profile/etc/profile.d/nix.sh
```

If you are using macOS and don't know how to do this, you are probably using the
bash shell running this command should add it properly:

```bash
echo ". $HOME/.nix-profile/etc/profile.d/nix.sh" >> ~/.bash_profile
```

If you are using a different shell, change `.bash_profile` to the appropriate
startup script for your shell.

After you have installed nix, if the `/etc/nix` directory does not exist, create
it (as root). Then put the following lines in your `/etc/nix/nix.conf` file:

```bash
substituters = https://nixcache.chainweb.com https://cache.nixos.org/
trusted-public-keys = nixcache.chainweb.com:FVN503ABX9F8x8K0ptnc99XEz5SaA4Sks6kNcZn2pBY= cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY=
experimental-features = nix-command flakes
```

## Restarting the Nix Daemon

In older versions of Nix, instead of `substituters` and `trusted-public-keys`,
use `binary-caches` and `binary-cache-public-keys` respectively.

If you installed Nix in multi-user mode or are running an older version, you may
need to restart nix-daemon to make your `nix.conf` changes take effect. To
figure out whether Nix is running in multi-user or single-user mode run this
command:

```bash
ps aux | grep nix-daemon
```

If you see only one line (the grep command that you just ran), then you are
using single-user mode and you don't have to do anything else. If you see a
nix-daemon line, then you are using multi-user mode and you need to restart the
nix daemon. Do this as follows.

On Mac:

```bash
sudo launchctl stop org.nixos.nix-daemon
sudo launchctl start org.nixos.nix-daemon
```

On Linux:

```bash
sudo systemctl restart nix-daemon.service
```

## Building

Once you've done this, run the following from the project directory that you
cloned:

```bash
nix-build
```

If you installed everything properly, you should see a bunch of lines that say
`copying path...` which tells you that pre-built artifacts are being
successfully downloaded from the cache. This process should take no more than
10-15 minutes on a reasonably fast internet connection. If it takes
substantially longer than that, you probably made a mistake in the above Nix
setup.
