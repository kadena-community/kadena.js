# Supported Environments

Date: 2023-06-13

Status: accepted

## Context

The tools and code **in this monorepo** run on various operating systems and environments, including
Node.js and browsers.

It's not feasible to support every operating system and every version of every browser on the
planet. To keep a sustainable pace of development without spending an irrational amount of efforts
spent in fixing bugs or developing features in environments only a small amount of people are using,
this section contains an overview of environments we fully test and support.

This decision does not cover:

- other repositories
- IDEs
- internal tooling such as Node.js

## Decision

This section contains an overview of environments we fully test and support.

### Developer machines

We support Linux and macOS environments, this includes Windows Subsystem for Linux (WSL).

We do not support other shells in Windows such as PowerShell or Git Bash. It may work, but bugs or
feature requests will have low priority.

### GitHub Actions

We run tests in GitHub Actions. We run tests in `ubuntu-latest`, since that covers most use cases
and is fast. It's also the most-used distro for WSL.

### Browsers

The documentation website, tools and tutorials should work in the **latest two versions** of all
major browsers:

- Brave
- Google Chrome
- Microsoft Edge
- Firefox
- Apple Safari + iOS Safari

## Consequences

Windows users may need to install WSL for development and to run tests.

Developers may be excluded from using our services or contributing to our codebase when they're
using unsupported environments or browsers.
