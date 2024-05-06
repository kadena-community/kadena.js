---
title: Pact-JS
description:
  The `@kadena/pactjs` library provides a TypeScript based application programming interface (API) for interacting with Pact smart contracts and the Kadena network.
menu: Kadena client
label: Pactjs
order: 4
layout: full
tags: ['TypeScript', 'Kadena client', 'frontend']
---

# @kadena/pactjs

The `@kadena/pactjs` library provides a TypeScript based application programming interface (API) for interacting with Pact smart contracts and the Kadena network.
The library includes the following functions:

- createExp
- ensureSignedCommand
- isSignedCommand
- PactNumber

## createExp

## ensureSignedCommand

## isSignedCommand

## PactNumber

// @alpha
export function createExp(firstArg: string, ...args: PactValue[]): PactCode;

// @alpha
export class PactNumber {
    constructor(value: string | number);
    // (undocumented)
    toDecimal(): string;
    // (undocumented)
    toInteger(): string;
    // (undocumented)
    toPactDecimal(): IPactDecimal;
    // (undocumented)
    toPactInteger(): IPactInt;
    // (undocumented)
    toStringifiedDecimal(): string;
    // (undocumented)
    toStringifiedInteger(): string;
}