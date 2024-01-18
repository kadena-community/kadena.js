---
title: Property and Invariant Functions
description:
  Pact comes equipped with the ability for smart contract authors to express and
  automatically check properties -- or, specifications -- of Pact programs.
menu: Property and Invariant Functions
label: Intro
order: 8
layout: full
tags:
  [
    'pact',
    'language reference',
    'property and invariant functions',
    'pact functions',
  ]
---

# Property and Invariant Functions

These are functions available in properties and invariants -- not necessarily in
executable Pact code. All of these functions are available in properties, but
only a subset are available in invariants. As a general rule, invariants have
vocabulary for talking about the shape of data, whereas properties also add
vocabulary for talking about function inputs and outputs, and database
interactions. Each function also explicitly says whether it's available in just
properties, or invariants as well.
