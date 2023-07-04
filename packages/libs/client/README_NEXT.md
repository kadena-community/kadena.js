# kadena@client

Core library for building Pact expressions to send to the blockchain in js.
Makes use of .kadena/pactjs-generated

<p align="center">

<picture>

<source srcset="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>

<img src="https://github.com/kadena-community/kadena.js/raw/master/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />

</picture>

</p>

<hr>

API Reference can be found here
[client.api.md](https://github.com/kadena-community/kadena.js/tree/master/packages/libs/client/etc/client.api.md)

<hr>

## Introduction

kadena@client is library to assist web developers to interact with kadena
blockchain. its included three main modules, that could be used independently or
together.

- commandBuilder
- sign
- getClient

## commandBuilder

`commandBuilder` helps you in building a command by exporting some helpers and
also using the power of pact-generator in order to have a perfect code
completion
