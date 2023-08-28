---
title: The EVM Is Fundamentally Unsafe
description:
  An in-depth examination of the Ethereum Virtual Machine vs. Kadena’s Pact
  smart contract language
menu: The EVM Is Fundamentally Unsafe
label: The EVM Is Fundamentally Unsafe
publishDate: 2018-12-14
author: Emily Pillmore
layout: blog
---

![](/assets/blog/1_zrqFVN1maTCedbz_OSl04Q.webp)

# The EVM Is Fundamentally Unsafe

_An in-depth examination of the Ethereum Virtual Machine vs. Kadena’s Pact smart
contract language_

Over the past three years of smart contract development, the cryptocurrency
community has seen smart contracts written in Solidity subverted by a variety of
bugs and exploits (the
[DAO exploit](https://www.coindesk.com/understanding-dao-hack-journalists), the
[Parity multi-sig wallet bug](https://cointelegraph.com/news/parity-multisig-wallet-hacked-or-how-come),
etc.), and it is common to pin the blame for the preponderance of unsafe smart
contracts on the Solidity smart contract language and its many quirks. However,
we maintain that some of the worst flaws in Solidity — a lack of inspection and
traceability, the opacity and illegibility of code on-chain, and expensive,
slow, and dangerous calls to external smart contracts — stem directly from
foundational design decisions in the architecture of the Ethereum Virtual
Machine (EVM).

While we are aware that the EWASM Working Group seeks to advance the state of
smart contract technology on Ethereum, we caution against disregarding the flaws
in EVM and pointing at the shiny new solution, because if design flaws are not
identified they are at grave risk of being repeated. In discussing these flaws
we will also contrast them with the decisions that inform the design of
[Pact](https://github.com/kadena-io/pact), [Kadena](http://kadena.io)’s
open-source smart contract language, which consciously avoids many of these
pitfalls.

### Virtual Machines and Beyond

A well-constructed Virtual Machine (VM) seeks to protect language designers from
dangerous mistakes and support efficient construction with central features like
dispatch support, name resolution and so forth. The EVM, however, fails to
provide similar guarantees, often with the vague justification of embodying a
core ethos of Ethereum, to present “a global computation machine.” It is
possible to have a Turing-complete machine without subjecting developers to
risks that modern VMs have eliminated for decades. Instead, the EVM disregards
this wisdom and expects the surface languages that compile to it to address
them.

Indeed, the EVM is too complex to be safe in the austerity of its bytecode
language and native functionality, but does not contain enough of the features
of a proper VM to be safe by construction. If the EVM were to adopt a stricter,
Turing-incomplete computational model, it could approach the safety guarantees
of Bitcoin bytecode. On the other hand, if the EVM offered features that one
would expect from a modern VM, then it would approach the low-level safety
afforded by machines such as the Java Virtual Machine (JVM).

Hence, any language targeting the EVM must contend with its unsafe design
choices and lack of modern VM features. Features such as dispatch and
abstraction must be handled entirely by the user-facing language, which leaves
language designers, such as the authors of Solidity, with a particularly
difficult job, and too many opportunities to make critical mistakes.

### EVM bytecode is not human-readable

Bitcoin provides a safe, simple, and effectively legible bytecode language
intended to guarantee the consistency and correctness of programs run on the
blockchain. It offers a minimal instruction set and uses bytecode primarily to
keep payloads small. It was never intended to be a compile target for a
general-purpose language. These deliberate, language-level restrictions minimize
the cognitive overhead of understanding what a given payload is actually doing
so that developers can reason more effectively about both their own code as well
as the code of others. Indeed, experienced Bitcoin developers can read and
interpret Bitcoin opcodes directly.

The creators of the EVM retained the bytecode model but ditched the idea of
small, easy-to-understand programs. Instead, they looked at bytecode as a
“target machine code” into which human-readable code is compiled. This is why
Solidity is impossible to read on-chain and must be decompiled to be debugged or
validated. Several projects within the Ethereum ecosystem seek to provide
additional assurance around the compiled code, such as the efforts to formally
verify Ethereum smart contracts via the F\* theorem proving language, by
specifying a Turing-incomplete sub-language of Solidity, albeit still in its
infancy as a research project. But as with many architectures with low-level
design mistakes, this represents a great deal of effort that could have been
avoided with the right design. Instead, the EVM extends Bitcoin bytecode but
makes it do too much in pursuit of providing a minimal compile target for
arbitrary higher-level code. In doing so, it loses the critical safety feature
of having human-readable contracts.

Pact takes a different approach by offering an interpreted language that is
directly executed, instead of compiled like Solidity. Additionally, it is also
built with a “smaller is better” ethos that is directly inspired by Bitcoin
script. The argument that a compiled language will be more performant than an
interpreted one is belied by countless databases running SQL at great speed, as
well as the huge strides made in improving Javascript interpreters. As history
has shown, if a language cannot provide inlining, caching, and “just-in-time”
optimization, an interpreted language can out-perform its compiled competitor,
while offering superior legibility.

The use of an interpreter means that deployed Pact code puts human-readable
smart contracts directly on-chain. Any language built on top of the EVM, in
contrast, will produce bytecode that will be illegible and unverifiable by
humans, and thus will only ever yield an incomplete understanding of the
functionality of programs written in that language. Finally, Pact reinforces
this notion of assurance by being a value-oriented functional programming
language: a developer or reader can use equational reasoning about Pact code in
a way that EVM bytecode could never admit.

### The EVM allows languages to be Turing complete

Bitcoin’s bytecode, in the vein of guaranteeing correctness, also contains
another important feature for safety purposes: Turing incompleteness. In doing
so, Bitcoin bytecode protects programs from vulnerability to recursive attacks,
and the risk of getting unintentionally trapped in an infinite loop, which is
both expensive on a distributed computer and a security exploit waiting to
happen.

At the inception of the EVM, Ethereum developers attempted to improve upon the
Bitcoin bytecode by offering an instruction set that was putatively similar to
Bitcoin but eliminating the Turing-incomplete constraint by adding JUMP, CALL,
and related instructions. These allow for non-terminating recursion, and
arbitrary control flow to code locations and other contracts in the system.

This has powerful and far-reaching consequences for the expressiveness and
correctness of programs run on the EVM, opening up these programs to an entire
class of bugs and non-deterministic behaviors that are inexpressible by a
Turing-incomplete language. The DAO exploit provides an excellent example, in
which the attacker could recursively withdraw from a wallet before balances were
settled, depositing millions into their accounts before terminating. The DAO
exploit also took advantage of the Solidity “default method” dispatch model,
which any sane modern VM would prohibit on principle, showing the danger of
leaving such functionality to higher-level constructs. Still, if the EVM had
restricted Turing-completeness in the first case, the DAO exploit could not have
occurred.

We see today the emergence of best practices in the Solidity development
ecosystem that require some sort of termination condition in the case where
either gas runs out, or recursion is provably terminating. This is a case of
users restricting their own instruction set; a situation that could have been
avoided with a more restricted computational model of the EVM.

In contrast, Pact, by design, is Turing-incomplete, to prevent recursion errors
and associated bad usage patterns. We maintain that the proportion of genuine
use-cases for recursion in the blockchain transactional environment is both
vanishingly small and not worth the safety risk to support. Plus, a blockchain
is by definition a computationally restricted environment, which is why a gas
model is needed, meaning that true recursive use cases will result in an
inability to predict resource usage, and should properly be executed off-chain.

### The EVM execution model is expensive, slow, and unsafe

The EVM leaves many features and critical components of its execution model
unhandled, forcing language designers to manually implement them. For example,
the EVM leaves the following features up to the language implementor:

- True library support, instead of just blessed CALL targets at well-known
  addresses

- Richer data types

- Direct support and enforcement of interfaces/APIs

In this way, the EVM abandons many of the defining features of true VMs, such as
dispatch, code introspection and the provision of a standard library, which
causes the execution environment to be expensive, slow, and unsafe.

In the EVM, when a contract is executed, the EVM employs an opaque, “top-down”
execution model, in which the entire body of the smart contract is loaded as an
opaque block of code and blindly executed from the first instruction, to run
through until it terminates. VMs like the JVM, in contrast, understand what
functions are expressed in particular namespaces or modules and allows them to
be loaded individually and called directly. The “top-down” model means that when
an external contract is called, the EVM must load the entire contract in order
to find and execute a single function.

Standard libraries are another common VM feature that is not supported by the
EVM. In the JVM for example, many common core functions are stored in a standard
“rt.jar” library distributed with the VM. If smart contracts had access to a
standard library, they would be able to defer many common tasks to the standard
library rather than implementing them in the smart contract directly. The cost
of executing every single instruction in a user smart contract every time forces
developers to pay significant extra gas just for the privilege of setting up
basic functionality needed to write the contract, making smart contracts on the
EVM much more expensive. Built-in contracts represent an unsatisfying workaround
that can mitigate gas cost but do nothing to improve the inefficient execution
model.

In addition to being slow and expensive, external calls on the EVM are deeply
unsafe. Because a calling contract has no ability to determine what in-contract
references are valid in some other contract, there is absolutely no protection
at runtime from a reference that refers to an absent or malformed reference.
This phenomenon fueled the Parity wallet issue, where wallets called a central,
core contract that was subsequently deleted, locking up funds contained in those
wallets. Meanwhile, the DAO hack was an example of an unsafe contract reference,
designed only for “user” accounts (EOAs or “externally owned accounts”), which
when called by a malicious contract account allowed the default method
(inexplicably executed on the “send” method for payment) to initiate the
recursion exploit.

Pact, in contrast, offers a standard library as a first principle, providing all
of the necessary tools a Pact author might need in order to write safe and
effective contracts. Moreover, Pact will never “run out of opcodes” or built-in
contract addresses, allowing it to incorporate new features as demand for them
is demonstrated. As a result, the gas model remains well-defined and static for
natively defined functions, which allows the user to construct their code in a
modular way while still retaining the ability to reason not just about the
functionality of their code, but its cost at runtime.

Additionally, when a Pact author invokes another contract on the blockchain, the
specific function code (with all of its transitive dependencies) are permanently
inlined at the user’s call site, so that execution is not only fast (code is in
the immediate scope) but also impossible to subvert at a later time, and thus
far safer.

### The EVM lacks native multi-sig support and upgradeable contracts

Contracts and accounts in Ethereum are referenced by address, which is a hashed
representation of some public key that innately enjoys the right to access the
address with elevated privileges. The consequence of this design choice commits
Ethereum and the EVM to disallowing native support for multi-signature
authentication and undergirds the misguided “code is law” design choice to make
smart contracts forever unable to upgrade the code at a particular address. This
is indeed one of the reasons the EVM lacks a modern dispatch mechanism as to do
this without any kind of name-based resolution would be an even more opaque
system than what confronts us today. However, the lack of dispatch and
name-based resolution essentially guarantees that the code cannot be upgraded,
as there is no primitive representation whatsoever of what code is contained at
an address (like a content hash, etc) so there would be no way to know if code
was upgraded.

To make matters worse, the single-address format essentially forces all
contracts in the EVM to be single signature and employ expensive built-in
contracts and/or multiple transaction calls to support multi-sig. If the EVM had
dispatch, a contract could be associated with an abstract name, which would
decouple signatures from a contract address, allowing for a contract to be
natively multi-sig.

As a result of these deficiencies, a cottage industry of multisig wallets,
contract standards, and techniques have been introduced in order to fill this
void. Proxy contracts, multi-sig validation functions, and wallets such as the
Gnosis, or Parity Multisig have been introduced to provide this much-needed
feature, but at the cost of additional expense to the multitude of addresses
governing the transaction. In contrast, Bitcoin and subsequently Pact never
constrained their designs around a single-signature approach, eliminating the
motivation for such workarounds. Indeed, Pact offers keysets as the validation
primitive, meaning that any transaction can choose to be multi- or single-sig
with no added complexity for the programmer. In addition, Pact provides a proper
dispatch model, allowing for named (and therefore upgradeable) smart contracts
as governed by a single- or multi-sig keyset.

### Conclusion

EWASM is a new effort to provide a safer alternative to the EVM on Ethereum, and
the EVM team has made incremental improvements to the EVM over the years.
Unfortunately, many of the factors that contribute to a unsafe and inefficient
user experience in the EVM cannot be resolved by patches or quick fixes, as they
are a consequence of deep architectural problems in the EVM’s design. The EVM
abandons the elegant simplicity of Bitcoin bytecode and the users pay for it: it
does not provide a safe and usable execution environment for language
developers.

While this article is critical of the EVM, we do not wish to pick fights with
Ethereum developers and respect the efforts being made to introduce a safer
alternative with EWASM. But insofar as EWASM does not challenge each of these
core concepts in the EVM, it will suffer a similar fate, as will the businesses
and developers who try to gain adoption of innovative ideas and use-cases, only
to lose money in avoidable exploits or excessive gas costs. At Kadena, we
designed Pact to tackle security and usability on a blockchain in a clearly
different way. An approach that puts control and safety back in the hands of the
developer. But we also hope that a clear view of EVM’s shortcomings will enrich
the general community’s understanding of the EVM and what EWASM must correct to
make a better future.
