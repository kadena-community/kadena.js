---
title: An Introductory Guide to Kadena Namespaces
description:
  When interacting with smart contracts on Chainweb, one will often see module
  names or module member expressions prefixed with static names such as free, or
  util, or kaddex (e.g. free.radio02.direct-to-send). We refer to these static
  prefixes as “namespaces”, and they form an integral part of the Kadena
  ecosystem that allows developers and users to write contract and keyset
  definitions within a private namespace that they govern themselves.
menu: Intro to Kadena Namespaces
label: Intro to Kadena Namespaces
publishDate: 2023-01-11
headerImage: /assets/blog/0_FfPIMjWvXsk0NFOP.webp
tags: [kadena, pact, chainweb]
author: Emily Pillmore
authorId: emily.pillmore
layout: blog
---

# An Introductory Guide to Kadena Namespaces

When interacting with smart contracts on
[Chainweb](https://github.com/kadena-io/chainweb-node), one will often see
module names or module member expressions prefixed with static names such as
**free**, or **util**, or **kaddex** (e.g. **free.radio02.direct-to-send**). We
refer to these static prefixes as “namespaces”, and they form an integral part
of the [Kadena](https://kadena.io/) ecosystem that allows developers and users
to write contract and keyset definitions within a private namespace that they
govern themselves. What’s interesting about namespaces in the Kadena public
blockchain in particular is that the method by which these namespaces are
allocated is defined in a smart contract itself within the root (i.e. empty)
namespace. This root namespace has special status in the blockchain as one of
the few contracts that the
[Pact](https://www.google.com/search?q=kadena+pact&oq=Kadena+Pact&aqs=chrome.0.69i59i512j0i512j0i22i30l2j0i390j69i60j69i61l2.5353j0j4&sourceid=chrome&ie=UTF-8)
application layer is aware of explicitly during transaction execution.

In the past, the means by which new namespaces were allocated was a centralized
process, with the namespace contract owners (the Kadena team) operating in a
similar manner to a root name server, writing namespaces to a registry upon
request. However, now that development is rapidly taking off in the Kadena
ecosystem, the Kadena team is introducing the first in a series of steps to
decentralize the registration process and delegate namespace definition to the
users, allowing them to create namespace names derived from their chosen means
of governance.

This article serves as an introduction to the concept of namespaces, how they
operate within Kadena, and how the new decentralized process works for users. If
you’re already familiar with namespaces and how they work, then feel free to
skip to the last section.

## What’s in Name(space)?

Kadena’s namespaces are relatively simple in practice. They are used in exactly
two scenarios:

1.  Contract definition, in which a module is published to a namespace, which
    allows one to access the module and its members by prefixing the namespace
    and a dot (e.g. if you have a namespace **my-namespace**, then if you define
    **my-module** within it, you may access its members by issuing
    **my-namespace.my-module.my-function**.

2.  Keyset definition, in which a keyset is defined within the namespace, and
    may be referenced by its name prefixed by the namespace name in which it was
    defined. This allows for keysets to exist with the same name, allowing the
    namespace to distinguish which keyset with a common name is being referenced
    at a particular point in code. This also works for named keyset references.

There are two builtins needed to define and “enter” a namespace in order to
define constructs: **define-namespace**, and **namespace**. Upon defining a
namespace, a user and admin governance protocol (a keyset or more generally, a
guard) must be supplied in order to define the namespace and who may upload to
it. For a more in-depth discussion, see the
[Pact Language ReadTheDocs](/build/pact/advanced#namespace-declarationh-1576233451).

All in all, the process is fairly simple. To define a namespace one must only
issue the following:

```pact
    (define-namespace "my-namespace"
     (read-keyset "my-admin-keyset")
     (read-keyset "my-users-keyset"))
```

And optionally, if one doesn’t want to continually prefix module names by a
particular prefix during the definition process, the user should issue:

```pact
    (namespace "my-namespace")
```

Now you’re off to the races. All definitions will be prefixed with a namespace
aside from keysets, which must be defined explicitly with the prefix in mind.
The administrative and user guards specifically refer to who “owns” the
namespace (who may administrate operators and general code owners), and who has
rights to publish definitions within the space (the users/operators).

## Namespaces in the Blockchain

In practice, when interacting with the Kadena public blockchain, the Pact
application layer implements the means by which namespace resolution is
achieved, so there is a bit of knot-tying that needs to happen in order to
resolve properly. At genesis all foundational contracts were uploaded to the
root namespace, which was reserved for special definitions. One of these was the
namespace contract called **ns**, which provided the resolution logic and
registry table for namespaces.

The transaction execution layer points to a particular function in that contract
called
“[validate](https://github.com/kadena-io/chainweb-node/blob/5ad28bc939c6fb7a398de67a5fec109a3e9cf989/pact/namespaces/ns.pact#L48)”
which provides the compile-time direction for resolving namespaces via the
namespace registry table. This is where the magic happens. The namespace
contract is not “special”, per se, in terms of upgradeability or ownership; the
logic by which names are resolved can be changed as demands change within the
ecosystem. **This is an extremely overpowered and underlooked feature unlike any
blockchain: namespaces and their associated resolution policies are built to
scale with the blockchain, and are immediately amenable to decentralized
governance.**

## Autonomously generated namespaces

As a first step towards decentralized namespace definition, Kadena has decided
to offer autonomous namespace definition derived from a keyset, and we’re
calling such a definition a “principal” namespace. These namespaces are
principal in the sense that they are autonomously reproducible from the
administrative keyset, and globally unique as a result. The process is fairly
simple, but does require a little knowledge in order to get started.

Kadena has upgraded its mainnet namespace contract (**ns**) to add a function
which the user may call in order to generate a principal namespace name they can
use without registering with the **ns** registry, as well as a change to the way
namespace validation is done in order to allow users to begin using their
principal namespaces with no further work. As a caveat, such principal namespace
definitions are only available for single and multisignature keysets.

To create a principal namespace, one only needs the keys they wish to
administrate the namespace, and to call the new **create-principal-namespace**
function exported from **ns**. In code:

```pact
    (ns.create-principal-namespace (read-keyset "my-admin-keyset"))
```

This creates a string that looks like the following:

```pact
    "n_c1a583206e24450af26de41110042b019695db8c"
```

This is opaque, and analogous to an IP address. The **n\_** prefixes a hash of
the keyset in order to denote that it’s a namespace, in the sense that
**http://** prefixes an address using the HTTP protocol. Their use is rather
simple — they can be used to define a namespace in the following manner:

```pact
    (define-namespace
     "n_c1a583206e24450af26de41110042b019695db8c"
     (read-keyset "my-admin-keyset")
     (read-keyset "my-users-keyset"))
    (namespace "n_c1a583206e24450af26de41110042b019695db8c")
```

When a user defines a construct within this namespace, they may begin using it
immediately with no further effort.

## What about vanity namespaces?

The immediate response to this is obviously going to be: “What an opaque format!
Can’t I have something like the cool kids with the .eth domains?” The answer is
that the current functionality is a stepping stone on the way to vanity domain
names in the same sense that the ENS-style name mappings resolve names to
contract addresses. The current iteration at the very least achieves
decentralized namespace definition, and is a necessary step to scaling the
Kadena blockchain for developers.

## Conclusion

I hope this whirlwind tour of namespaces has been helpful for everyone! We
strive to provide as many updates as possible as Kadena continues to innovate.
We have a bright, bullish future ahead of us as we continue to unlock the power
of decentralization and scalability for our ecosystem developers. Stay tuned for
2023 — there’s far more to come!
