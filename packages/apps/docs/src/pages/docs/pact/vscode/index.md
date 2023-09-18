---
title: Visual Studio Code configuration for Pact
description:
  This document describes how to configure Visual Studio code for Pact
  development using the Pact extension.
menu: Visual Studio Code
label: Visual Studio Code
order: 9
layout: full
tags:
  [
    pact,
    IDE integration,
    Visual Studio Code configuration,
    Visual Studio Code extension,
    Visual Studio Code pact extension,
  ]
---

# Visual Studio Code configuration for Pact

Kadena provides a Visual Studio Code extension to streamline your smart contract
development experience with Pact. Before installing the extension, make sure
that you have installed
[Pact](https://github.com/kadena-io/pact#installing-pact), as well as
[Pact Language Server](https://github.com/kadena-io/pact-lsp/releases).

## Installing the Pact Extension

Open Visual Studio Code and click the Extensions icon in the Activity Bar on the
far left of the window. In the sidebar that pops op, search for "Pact". Install
the "PACT - PACT Programming Language" extension. During installation of the
extension, you may be prompted to install additional extension required by the
Pact extension. Install the additional extension to enjoy the full functionality
of the Pact extension. Open the Visual Studio Code settings and search for
"Pact". Configure the path to the Pact executable and the Pact Language server
executable. Or just use `pact` and `pact-lsp` respectively if you added the
executables to your `PATH`.

## Enable trace

Check the "Enable trace" box in the Pact extension settings to enable the output
trace for Pact. Everytime you save a file, the `pact` command will run with the
`-t` flag when this setting is enabled, providing you detailed line by line
information about `.pact` and `.repl` file execution.

## Enable LSP

Check the "Enable LSP" box in the Pact extension settings to enable the Pact
Language server. With this setting enabled, you syntax errors will be
highlightedin `.pact` files and problems will be reported in the Status Bar and
Bottom Panel of the Visual Studio Code window.

## Enable coverage

Check the "Enable coverage" box in the Pact extension settings to enable code
coverage reporting for `.pact` and `.repl` files. Everytime you save a `.repl`
file, code coverage will be calculated for the respective file and all the
`.pact` and `.repl` files that it loads. Covered lines will be highlighted in
green in your editor and uncovered lines will be highlighted red. To view a code
coverage report in HTML format, right-click the `./coverage/html/index.html`
file relative to the file that was run. Click "Show preview" to open the report.
To run all your `.repl` files at once, simply create an entrypoint `.repl` file
that loads all the other `.repl` files in your project. Open the entrypoint file
and save it to run all your tests.
