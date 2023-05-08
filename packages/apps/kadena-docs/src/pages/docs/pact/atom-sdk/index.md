---
title: Welcome to pact
menu: Atom SDK
label: Quickstart
order: 5
description: How to get started
layout: full
---

## Section 1

Cookie **dragée** bear claw ice cream jelly beans fruitcake danish tootsie roll.

## Customizing nodes

You define custom nodes by passing a custom Node to your

```javascript
import * as components from './components';

const config = {
  nodes: {
    heading,
  },
};

const ast = MDX.parse(doc);
const content = MDX.transform(ast, config);

const children = MDX.renderers.react(content, React, { components });
```

where `heading` looks something like:

## Section 2

Halvah carrot cake cheesecake biscuit powder toffee fruitcake. Marshmallow jelly

### Section 2.1

Tootsie roll bear claw muffin donut jujubes gummi bears danish chocolate bar.

### Section 2.2

Lollipop cookie chocolate chocolate gummi bears. Jujubes powder gummi bears

#### Section 2.2.1

Lollipop cookie chocolate chocolate gummi bears. Jujubes powder gummi bears

## Section 3

Powder biscuit fruitcake shortbread topping candy cheesecake. Chupa chups wafer
