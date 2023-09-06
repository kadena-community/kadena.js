---
title: Language Server Support for Pact
description:
  Tools that support the development process of software are crucial for
  ensuring the quality, security, and timeliness of software. This is especially
  important in the context of smart contracts, which are self-executing programs
  in a distributed environment. As a result, smart contracts require a high
  level of security to protect against vulnerabilities that could compromise the
  integrity of the contract.
menu: Language Server Support for Pact
label: Language Server Support for Pact
publishDate: 2023-04-18
author: Robert Soeldner
authorId: robert.soeldner
layout: blog
---

# Language Server Support for Pact

![](/assets/blog/1_NzViJSe3eJ45qJfeqLh1Lw.webp)

Tools that support the development process of software are crucial for ensuring
the quality, security, and timeliness of software. This is especially important
in the context of smart contracts, which are self-executing programs in a
distributed environment. As a result, smart contracts require a high level of
security to protect against vulnerabilities that could compromise the integrity
of the contract.

The
[Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
(LSP) is a protocol developed by Microsoft to standardize the communication
between development tools, such as the editors and IDEs. The language server
provides language-specific services such as code completion and error checking.
The LSP has become increasingly popular in the development community, with
support from a growing number of programming languages and development tools.

By leveraging the LSP, Kadena provides a better user experience and increased
support for the development of secure contracts within the developer’s preferred
integrated development environment.

While previous tooling-support was mainly limited to the
[Atom IDE](https://github.com/kadena-io/pact-atom/), the LSP server now allows
integration with a wide variety of editors, including Emacs and vim.

The [current support](https://github.com/kadena-io/pact-lsp) for the Language
Server Protocol includes a range of useful features for developing smart
contracts securely. One of these features is **document diagnostics**, which can
provide real-time feedback on potential issues and vulnerabilities within the
code. In addition to standard diagnostics, this support also includes **Pact
traces**, which allow developers to trace the execution of a Pact smart contract
and identify any issues that may arise during runtime. Another feature is
**auto-completion of natives**, which can save time and reduce the risk of
syntax errors. Finally, **documentation over natives** via hover information
provides additional context for developers, allowing them to understand the
available functions and parameters for specific natives.

By combining these features with other LSP-enabled tools, developers can improve
the security and quality of their smart contracts, while also increasing
productivity and reducing the risk of errors.

Future developments for the LSP server are focused on improving the development
experience and security of smart contracts. One feature currently in development
is **jump to definition**, which allows developers to quickly navigate to the
definition of a function or variable within their code. This can save time and
improve productivity, especially for larger and more complex projects. Another
area of focus is **formal verification code actions**, which will enable
automated verification support of smart contracts using Pacts formal method.
This can help identify potential security vulnerabilities and ensure that the
contract behaves as intended.

Finally, future developments will include continued **integration with Visual
Studio Code** (VSCode), a popular choice for Smart Contract development. But we
are also looking into support for IntelliJ. We can now even look into options to
create our IDE at one point in time so that we can integrate Smart contract
deployment in your development environment.

With continued support for LSP, Pact users can benefit from a range of language
features and security analysis functionality within their preferred IDE.
Overall, these developments demonstrate a commitment to improving the
development experience and security of smart contracts using LSP-enabled tools.
