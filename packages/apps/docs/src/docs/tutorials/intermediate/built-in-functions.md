---
title: Built in Functions
description:
  In this guide, we will go through and explain specific built-in functions that
  are listed in the pact reference page
menu: Built in Functions
label: Built in Functions
order: 5
layout: full
tags: ['pact', 'built in functions', 'intermediate', 'pact tutorials']
---

# Built in Functions

Welcome to this introduction to some more advanced Pact built-in functions.

In this guide, we will go through and explain specific built-in functions that
are listed in the [pact reference page](/build/pact/built-in-functions).

## Simple Payment Verification

The quick explanation of the `verify-spv` function can be found
[here](/reference/functions/spv).

`verify-spv` takes some blob, a binary data type, provided by the user and runs
code on it that would be too expensive to do in pact. Thus, in the statement
`(verify-spv "ETH")`, "ETH" has code in the chainweb-node binary to validate
that the data is well-formed and returns a normal Pact object with all of the
data. It is NOT an oracle; it is a tool that an oracle would use to guarantee
data integrity.
[Here](https://github.com/kadena-io/kadenaswap/blob/master/pact/relay/kerc/kERC.pact#L210-L245)
is example code using the chain relay to validate a proof that the sender has
retrieved from infura.

In a REPL script, all you can do is simulate this, as the "ETH" support does not
ship with Pact. The
[`mock-spv`](/reference/functions/repl-only-functions#mock-spvh-643983626)
REPL native allows you to mock a call to verify-spv
([github](https://github.com/kadena-io/kadenaswap/blob/master/pact/relay/kerc/kERC.repl#L44-L81)).

You can simulate any protocol desired. However, getting a protocol added to
Chainweb requires support in the Chainweb binary and is a hard fork. Therefore,
the community would need to spearhead by opening a pull request for a KIP,
Kadena Improvement Process. For instance, to support BTC proofs, a KIP would be
opened to add `verify-spv "BTC"` to discuss and specify what is needed.
Afterwards, the Haskell support would need to be implemented and released with a
Chainweb version upgrade. Currently Chainweb supports "ETH" and "TXOUT" only
([github](https://github.com/kadena-io/chainweb-node/blob/f0b47973f1653878d7a51b73b4422f980b67dd84/src/Chainweb/Pact/SPV.hs#L120-L152)).

::: note

TXOUT is the same as what is used for crosschain, but should not be used for
"once-and-only-once" which demands using a cross-chain defpact to enforce. TXOUT
can be used for "broadcast" of e.g. a price feed to other chains.

::

## Managed Capabilities

Documentation for understanding capabilities can be found
[here](/build/pact/advanced#capabilitiesh-1323277354).

The capability built-in functions can be found
[here](/reference/functions/capabilities#compose-capabilityh1942343731).

Before diving into managed capabilities, it is important to understand the
difference between managed and unmanaged capabilities. Capabilities are never
"changed" since they are only granted by `with-capability`. In addition to
defining a capability, managed capabilities also define a "resource" that is
decreased whenever the associated capability is granted.

Think of it like this, stateless capabilities are granted by `with-capability`
and demanded by `require-capability`. Managed capabilities setup an initial
"resource" by `install-capability`, then deduct from the resource, granted by
`with-capability`, and are demanded by `require-capability`.

Note that `install-capability` is unique to managed capabilities while
`with-capability` does double duty. `with-capability` essentially is two
separate operations composed together in the managed case:

```bash title=" "
;; You write this:
(install-capability (TRANSFER FROM TO PROVIDED))
...
(with-capability (TRANSFER FROM TO REQUESTED) EXPR)

;; ----

;; But what it does internally is more like this:
(install-capability (TRANSFER FROM TO) PROVIDED)
...
(if (already-granted-p (TRANSFER FROM TO))
    EXPR
  (consume-resource (TRANSFER FROM TO) REQUESTED
    (with-capability (TRANSFER FROM TO) EXPR)))
```

You can see here that `(TRANSFER FROM TO)` identifies the capability - in both
the managed and unmanaged cases. The extra parameter relating to the resource is
what's new in the managed case. The fact that it gets passed as an argument in
`(TRANSFER FROM TO AMOUNT)` to both `install-capability` and `with-capability`
is just a syntactic convenience.

Now lets take a look at the
[TRANSFER managed capability](/build/pact/advanced#the-transfer-managed-capabilityh262225727)
to get a better understanding.

The `@managed` keyword identifies the argument referring to the resource
parameter. In the case of `TRANSFER`, this is the `amount` argument, as declared
by:

```bash title=" "
@managed amount TRANSFER_mgr
```

This also states that `TRANSFER_mgr` will receive two arguments related to the
amount:

1. The current amount of the resource
2. The proposed amount to be deducted by the call to `with`

```bash title=" "
(defun TRANSFER_mgr:decimal (current:decimal requested:decimal)
```

For `install-capability`, the `amount` argument passed is the initial amount of
the resource. For `with-capability`, the `amount` argument is the amount of
resource being requested before the capability can be granted. In that case, the
current amount that is passed as the first argument to the management function
comes from the current state of the Pact evaluator.

`@managed` allows for only a single argument, but lists and objects are valid
arguments too. For example, you could provide a list of names as the "resource"
and write a management function that removes names from the list as they are
"used." If you wanted a single managed capability to manage multiple resources,
you could use an object instead.

:::note

The managed capability feature is most commonly used by coin contracts to govern
transfer amounts.

:::

The manager function has the job of confirming that sufficient resource exists
and deducting from the resource. It is called whenever `with-capability` is used
and the capability has not yet been granted.

## Select

The `select` built-in function can be found
[here](/pact/beginner/schemas-and-tables#selecth-1822154468).

The `select` function is able to pull information from a table under specific
conditions.

This is an example of finding people in a table with a single condition, having
"Fatima" as their first or last name.

```bash title=" "
(select people ['firstName,'lastName] (where 'name (= "Fatima")))
```

But, what if you want to use multiple clauses to get a more specific result.

In this example, you can use the following format to find someone with the name
"Fatima" that is older than 40.

```bash title=" "
(select people ['firstName,'lastName] (and? (where 'name (= "Fatima")) (where 'age (> 40))))
```
