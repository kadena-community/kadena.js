---
title: ZK
description:
  This document is a reference for the Pact smart-contract language, designed
  for correct, transactional execution on a high-performance blockchain.
menu: ZK
label: ZK
order: 10
layout: full
tags: ['pact', 'language reference', 'zk', 'zk proof verification']
---

# Zk

## pairing-check

_points-g1_&nbsp;`[<a>]` _points-g2_&nbsp;`[<b>]` _&rarr;_&nbsp;`bool`

Perform pairing and final exponentiation points in G1 and G2 in BN254, check if
the result is 1

## point-add

_type_&nbsp;`string` _point1_&nbsp;`<a>` _point2_&nbsp;`<a>` _&rarr;_&nbsp;`<a>`

Add two points together that lie on the curve BN254. Point addition either in Fq
or in Fq2

```pact
pact> (point-add 'g1 {'x: 1, 'y: 2}  {'x: 1, 'y: 2})
{"x": 1368015179489954701390400359078579693043519447331113978918064868415326638035,"y": 9918110051302171585080402603319702774565515993150576347155970296011118125764}
```

## scalar-mult

_type_&nbsp;`string` _point1_&nbsp;`<a>` _scalar_&nbsp;`integer`
_&rarr;_&nbsp;`<a>`

Multiply a point that lies on the curve BN254 by an integer value

```pact
pact> (scalar-mult 'g1 {'x: 1, 'y: 2} 2)
{"x": 1368015179489954701390400359078579693043519447331113978918064868415326638035,"y": 9918110051302171585080402603319702774565515993150576347155970296011118125764}
```
