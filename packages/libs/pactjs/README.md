<!-- genericHeader start -->

# @kadena/pactjs

Collection of utility functions for working with Pact smart contracts and blockchain data

<picture>
  <source srcset="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-white.png" media="(prefers-color-scheme: dark)"/>
  <img src="https://raw.githubusercontent.com/kadena-community/kadena.js/main/common/images/Kadena.JS_logo-black.png" width="200" alt="kadena.js logo" />
</picture>

<!-- genericHeader end -->

[![npm version](https://img.shields.io/npm/v/@kadena/pactjs.svg)](https://www.npmjs.com/package/@kadena/pactjs)
[![API Reference](https://img.shields.io/badge/API-Reference-blue.svg)](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs/etc/pactjs.api.md)

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [PactNumber](#pactnumber)
  - [createExp](#createexp)
  - [isSignedCommand](#issignedcommand)
- [Working with Numbers](#working-with-numbers)
- [Creating Pact Expressions](#creating-pact-expressions)
- [Command Validation](#command-validation)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

`@kadena/pactjs` is a low-level utility library for working with Pact, Kadena's smart contract language. It provides essential tools for:

- **Number handling**: Safe decimal and integer operations with `PactNumber`
- **Expression building**: Programmatically create Pact expressions
- **Command validation**: Verify transaction signatures

This library is typically used as a foundation by higher-level libraries like `@kadena/client`. Most developers should use `@kadena/client` for blockchain interactions, but `@kadena/pactjs` is useful when you need fine-grained control over Pact data structures.

## Installation

```sh
npm install @kadena/pactjs
```

For TypeScript projects:

```sh
npm install @kadena/pactjs
npm install --save-dev @kadena/types
```

## Quick Start

### Working with Pact Numbers

```ts
import { PactNumber } from '@kadena/pactjs';

// Create a Pact decimal
const amount = new PactNumber('123.456');
const pactDecimal = amount.toPactDecimal();
// { decimal: "123.456" }

// Perform calculations
const total = new PactNumber('100.5')
  .plus('50.25')
  .toPactDecimal();
// { decimal: "150.75" }

// Create a Pact integer
const count = new PactNumber('42');
const pactInteger = count.toPactInteger();
// { int: "42" }
```

### Creating Pact Expressions

```ts
import { createExp } from '@kadena/pactjs';

// Simple expression
const expr = createExp('coin.get-balance', 'alice');
// "(coin.get-balance alice)"

// Expression with multiple arguments
const transferExpr = createExp(
  'coin.transfer',
  'alice',
  'bob',
  { decimal: '10.0' }
);
// "(coin.transfer alice bob { decimal: '10.0' })"
```

### Validating Signed Commands

```ts
import { isSignedCommand } from '@kadena/pactjs';

if (isSignedCommand(transaction)) {
  // Transaction has all required signatures
  await submitToBlockchain(transaction);
} else {
  console.error('Transaction is missing signatures');
}
```

## API Reference

### PactNumber

A BigNumber-based class for handling Pact integers and decimals with arbitrary precision.

#### Constructor

```ts
new PactNumber(value: string | number | { int: string } | { decimal: string })
```

**Parameters:**
- `value`: Number value as string, number, or Pact number object

**Examples:**
```ts
// From string
const num1 = new PactNumber('123.456');

// From number
const num2 = new PactNumber(789);

// From Pact integer
const num3 = new PactNumber({ int: '42' });

// From Pact decimal
const num4 = new PactNumber({ decimal: '3.14159' });
```

#### Methods

##### `toPactDecimal()`

Converts to Pact decimal format.

```ts
toPactDecimal(): { decimal: string }
```

**Example:**
```ts
const num = new PactNumber('123.45');
num.toPactDecimal();
// { decimal: "123.45" }

const integer = new PactNumber('100');
integer.toPactDecimal();
// { decimal: "100.0" }
```

---

##### `toPactInteger()`

Converts to Pact integer format. Throws if the number is not an integer.

```ts
toPactInteger(): { int: string }
```

**Example:**
```ts
const num = new PactNumber('42');
num.toPactInteger();
// { int: "42" }

const decimal = new PactNumber('42.5');
decimal.toPactInteger();
// Error: PactNumber is not an integer
```

---

##### `toDecimal()`

Returns string representation as decimal.

```ts
toDecimal(): string
```

**Example:**
```ts
new PactNumber('123.45').toDecimal();
// "123.45"

new PactNumber('100').toDecimal();
// "100.0"
```

---

##### `toInteger()`

Returns string representation as integer. Throws if the number is not an integer.

```ts
toInteger(): string
```

**Example:**
```ts
new PactNumber('42').toInteger();
// "42"

new PactNumber('42.5').toInteger();
// Error: PactNumber is not an integer
```

---

##### `toStringifiedDecimal()`

Returns JSON-stringified decimal.

```ts
toStringifiedDecimal(): string
```

**Example:**
```ts
new PactNumber('123.45').toStringifiedDecimal();
// '"123.45"'
```

---

##### `toStringifiedInteger()`

Returns JSON-stringified integer. Throws if the number is not an integer.

```ts
toStringifiedInteger(): string
```

**Example:**
```ts
new PactNumber('42').toStringifiedInteger();
// '"42"'
```

---

##### BigNumber Methods

`PactNumber` extends `BigNumber.js`, so all BigNumber methods are available:

```ts
// Arithmetic
.plus(value)          // Addition
.minus(value)         // Subtraction
.multipliedBy(value)  // Multiplication
.dividedBy(value)     // Division
.modulo(value)        // Modulo

// Comparison
.isEqualTo(value)     // Equality check
.isGreaterThan(value) // Greater than
.isLessThan(value)    // Less than
.isInteger()          // Check if integer
.isNaN()              // Check if NaN
.isZero()             // Check if zero

// Utility
.abs()                // Absolute value
.negated()            // Negative value
.precision(n)         // Set precision
.decimalPlaces(n)     // Set decimal places
```

**Example:**
```ts
const balance = new PactNumber('100.50');
const fee = new PactNumber('2.25');
const total = balance.minus(fee).toPactDecimal();
// { decimal: "98.25" }

const isPositive = balance.isGreaterThan(0);
// true
```

---

### createExp

Creates a Pact s-expression from arguments.

```ts
function createExp(firstArg: string, ...args: PactValue[]): PactCode
```

**Parameters:**
- `firstArg`: Function or expression name
- `...args`: Additional arguments (strings, numbers, objects, etc.)

**Returns:** Pact code as a string

**Examples:**

```ts
import { createExp } from '@kadena/pactjs';

// Simple function call
createExp('coin.get-balance', 'alice');
// "(coin.get-balance alice)"

// Function with multiple arguments
createExp('coin.transfer', 'alice', 'bob', { decimal: '10.0' });
// "(coin.transfer alice bob {decimal: '10.0'})"

// Nested expressions
createExp('if',
  createExp('>', 'balance', '100'),
  createExp('transfer', 'alice', 'bob', '100'),
  createExp('transfer', 'alice', 'bob', 'balance')
);
// "(if (> balance 100) (transfer alice bob 100) (transfer alice bob balance))"

// With Pact number
const amount = new PactNumber('42.5').toPactDecimal();
createExp('transfer', 'alice', 'bob', amount);
// "(transfer alice bob {decimal: '42.5'})"
```

---

### isSignedCommand

Checks if a command has all required signatures.

```ts
function isSignedCommand(
  command: IUnsignedCommand | ICommand
): command is ICommand
```

**Parameters:**
- `command`: Command to check (signed or unsigned)

**Returns:** `true` if all signatures are present, `false` otherwise

**Type Guard:** This function is a TypeScript type guard that narrows the type to `ICommand` when it returns `true`.

**Example:**
```ts
import { isSignedCommand } from '@kadena/pactjs';

const transaction = {
  cmd: '{"payload": {...}}',
  hash: 'abc123...',
  sigs: [
    { sig: 'signature1...' },
    { sig: 'signature2...' }
  ]
};

if (isSignedCommand(transaction)) {
  // TypeScript knows transaction is ICommand here
  await submitToBlockchain(transaction);
} else {
  console.error('Missing signatures');
}
```

---

### ensureSignedCommand

Ensures a command is signed, throwing an error if not.

```ts
function ensureSignedCommand(
  command: IUnsignedCommand | ICommand
): ICommand
```

**Parameters:**
- `command`: Command to validate

**Returns:** The command as `ICommand`

**Throws:** Error if command is not fully signed

**Example:**
```ts
import { ensureSignedCommand } from '@kadena/pactjs';

try {
  const signedCmd = ensureSignedCommand(transaction);
  await submitToBlockchain(signedCmd);
} catch (error) {
  console.error('Transaction not signed:', error.message);
}
```

---

## Working with Numbers

### Why PactNumber?

Pact uses arbitrary-precision decimals to prevent rounding errors in financial calculations. JavaScript's native `Number` type uses floating-point arithmetic, which can cause precision issues:

```ts
// JavaScript floating-point issues
0.1 + 0.2 === 0.3  // false! (0.30000000000000004)

// PactNumber maintains precision
new PactNumber('0.1')
  .plus('0.2')
  .isEqualTo('0.3')  // true
```

### Integer vs Decimal

Pact distinguishes between integers and decimals:

```ts
// Integer
const count = new PactNumber('42').toPactInteger();
// { int: "42" }

// Decimal
const amount = new PactNumber('42.0').toPactDecimal();
// { decimal: "42.0" }

// Trying to use a decimal as an integer throws
const notInteger = new PactNumber('42.5').toPactInteger();
// Error: PactNumber is not an integer
```

### Common Calculations

```ts
import { PactNumber } from '@kadena/pactjs';

// Calculate total with fee
const subtotal = new PactNumber('100.00');
const tax = new PactNumber('8.50');
const total = subtotal.plus(tax);
// 108.50

// Calculate percentage
const amount = new PactNumber('1000');
const percentage = new PactNumber('0.05'); // 5%
const fee = amount.multipliedBy(percentage);
// 50.0

// Calculate remaining balance
const balance = new PactNumber('500.75');
const withdrawal = new PactNumber('123.50');
const remaining = balance.minus(withdrawal);
// 377.25

// Check if sufficient funds
if (balance.isGreaterThanOrEqualTo(withdrawal)) {
  // Process withdrawal
}

// Format for Pact
const pactAmount = remaining.toPactDecimal();
// { decimal: "377.25" }
```

### Handling User Input

```ts
function parseUserAmount(input: string): { decimal: string } {
  try {
    const num = new PactNumber(input);

    // Validate positive
    if (num.isLessThanOrEqualTo(0)) {
      throw new Error('Amount must be positive');
    }

    // Limit decimal places
    if (num.decimalPlaces() > 12) {
      throw new Error('Too many decimal places');
    }

    return num.toPactDecimal();
  } catch (error) {
    throw new Error(`Invalid amount: ${error.message}`);
  }
}

// Usage
const amount = parseUserAmount('123.45');
// { decimal: "123.45" }
```

### Exponential Notation Prevention

`PactNumber` is configured to prevent exponential notation:

```ts
// Regular JavaScript
const big = 1e20;
big.toString();
// "100000000000000000000" or "1e+20"

// PactNumber
const bigPact = new PactNumber('100000000000000000000');
bigPact.toString();
// "100000000000000000000" (always in full notation)
```

## Creating Pact Expressions

### Basic Expressions

```ts
import { createExp } from '@kadena/pactjs';

// Function call
createExp('coin.details', 'alice');
// "(coin.details alice)"

// Multiple arguments
createExp('coin.transfer', 'alice', 'bob', { decimal: '10.0' });
// "(coin.transfer alice bob {decimal: '10.0'})"
```

### Nested Expressions

```ts
// Conditional expression
const ifExpr = createExp(
  'if',
  createExp('>', 'balance', '100'),
  '"sufficient"',
  '"insufficient"'
);
// "(if (> balance 100) \"sufficient\" \"insufficient\")"

// Let binding
const letExpr = createExp(
  'let',
  createExp('x', '10'),
  createExp('+', 'x', '5')
);
// "(let (x 10) (+ x 5))"
```

### Complex Expressions

```ts
// Multi-step transaction
const multiStep = createExp(
  'let*',
  [
    createExp('balance', createExp('coin.get-balance', 'alice')),
    createExp('fee', { decimal: '0.5' }),
    createExp('amount', createExp('-', 'balance', 'fee'))
  ],
  createExp('coin.transfer', 'alice', 'bob', 'amount')
);
```

### With PactNumber

```ts
import { PactNumber, createExp } from '@kadena/pactjs';

const amount = new PactNumber('123.45').toPactDecimal();
const fee = new PactNumber('2.50').toPactDecimal();

const expr = createExp('transfer-with-fee', 'alice', 'bob', amount, fee);
// "(transfer-with-fee alice bob {decimal: '123.45'} {decimal: '2.50'})"
```

## Command Validation

### Checking Signatures

```ts
import { isSignedCommand } from '@kadena/pactjs';

function submitTransaction(tx: IUnsignedCommand | ICommand) {
  if (!isSignedCommand(tx)) {
    throw new Error('Transaction must be signed before submission');
  }

  // TypeScript knows tx is ICommand here
  return fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(tx)
  });
}
```

### Validation Pipeline

```ts
import { isSignedCommand, ensureSignedCommand } from '@kadena/pactjs';

function validateAndSubmit(tx: IUnsignedCommand | ICommand) {
  // Option 1: Type guard
  if (isSignedCommand(tx)) {
    return submitToBlockchain(tx);
  } else {
    throw new Error('Missing signatures');
  }

  // Option 2: Assertion
  const signedTx = ensureSignedCommand(tx);
  return submitToBlockchain(signedTx);
}
```

### Counting Signatures

```ts
function countSignatures(command: IUnsignedCommand | ICommand): number {
  return command.sigs.filter(s => s?.sig !== undefined).length;
}

function getSignatureStatus(command: IUnsignedCommand | ICommand) {
  const total = command.sigs.length;
  const signed = countSignatures(command);

  return {
    total,
    signed,
    missing: total - signed,
    complete: isSignedCommand(command)
  };
}
```

## Examples

### Example 1: Calculate Transfer Amount with Fee

```ts
import { PactNumber, createExp } from '@kadena/pactjs';

function calculateTransferWithFee(
  amount: string,
  feePercentage: string
): { decimal: string } {
  const transferAmount = new PactNumber(amount);
  const fee = transferAmount.multipliedBy(feePercentage);
  const total = transferAmount.plus(fee);

  return total.toPactDecimal();
}

// Usage
const total = calculateTransferWithFee('100', '0.025'); // 2.5% fee
// { decimal: "102.5" }
```

### Example 2: Build Complex Pact Expression

```ts
import { createExp, PactNumber } from '@kadena/pactjs';

function buildSwapExpression(
  user: string,
  tokenA: string,
  tokenB: string,
  amountIn: string,
  minAmountOut: string
): string {
  const amountInDecimal = new PactNumber(amountIn).toPactDecimal();
  const minAmountOutDecimal = new PactNumber(minAmountOut).toPactDecimal();

  return createExp(
    'swap.swap-exact-in',
    user,
    tokenA,
    tokenB,
    amountInDecimal,
    minAmountOutDecimal
  );
}

// Usage
const swapExpr = buildSwapExpression(
  'alice',
  'coin',
  'kda-usd',
  '100',
  '95'
);
// "(swap.swap-exact-in alice coin kda-usd {decimal: '100.0'} {decimal: '95.0'})"
```

### Example 3: Validate Multi-Sig Transaction

```ts
import { isSignedCommand } from '@kadena/pactjs';

interface MultiSigStatus {
  isComplete: boolean;
  signedCount: number;
  totalRequired: number;
  missingSignatures: number;
}

function checkMultiSigStatus(
  transaction: IUnsignedCommand | ICommand
): MultiSigStatus {
  const totalRequired = transaction.sigs.length;
  const signedCount = transaction.sigs.filter(s => s?.sig).length;

  return {
    isComplete: isSignedCommand(transaction),
    signedCount,
    totalRequired,
    missingSignatures: totalRequired - signedCount
  };
}

// Usage
const status = checkMultiSigStatus(transaction);
if (!status.isComplete) {
  console.log(`Waiting for ${status.missingSignatures} more signatures`);
}
```

### Example 4: Safe Division with Remainder

```ts
import { PactNumber } from '@kadena/pactjs';

function divideWithRemainder(
  dividend: string,
  divisor: string
): { quotient: { int: string }, remainder: { decimal: string } } {
  const a = new PactNumber(dividend);
  const b = new PactNumber(divisor);

  if (b.isZero()) {
    throw new Error('Division by zero');
  }

  const quotient = a.dividedBy(b).integerValue(BigNumber.ROUND_DOWN);
  const remainder = a.modulo(b);

  return {
    quotient: quotient.toPactInteger(),
    remainder: remainder.toPactDecimal()
  };
}

// Usage
const result = divideWithRemainder('100', '7');
// { quotient: { int: "14" }, remainder: { decimal: "2.0" } }
```

## TypeScript Support

### Type Definitions

All exports include full TypeScript definitions:

```ts
import type { PactValue, PactCode, ICommand, IUnsignedCommand } from '@kadena/types';
import { PactNumber, createExp, isSignedCommand } from '@kadena/pactjs';

// PactNumber type inference
const num = new PactNumber('123.45');
// num: PactNumber

const decimal = num.toPactDecimal();
// decimal: { decimal: string }

const integer = num.toPactInteger();
// integer: { int: string }

// Expression types
const expr = createExp('coin.transfer', 'alice', 'bob', decimal);
// expr: PactCode (which is string)

// Command validation with type guards
function submit(cmd: IUnsignedCommand | ICommand) {
  if (isSignedCommand(cmd)) {
    // cmd: ICommand
    return submitToBlockchain(cmd);
  } else {
    // cmd: IUnsignedCommand
    throw new Error('Not signed');
  }
}
```

### Generic Constraints

```ts
import { PactNumber } from '@kadena/pactjs';

function processAmount<T extends { decimal: string }>(
  amount: T
): PactNumber {
  return new PactNumber(amount);
}

// Usage
const pactDecimal = { decimal: '123.45' };
const num = processAmount(pactDecimal);
```

## Best Practices

### 1. Always Use Strings for Number Construction

```ts
// Good - Precise
new PactNumber('0.1');

// Bad - May lose precision
new PactNumber(0.1);
```

### 2. Validate User Input

```ts
function validateAmount(input: string): PactNumber {
  // Check format
  if (!/^\d+(\.\d+)?$/.test(input)) {
    throw new Error('Invalid number format');
  }

  const num = new PactNumber(input);

  // Validate range
  if (num.isLessThanOrEqualTo(0)) {
    throw new Error('Amount must be positive');
  }

  // Validate precision
  if (num.decimalPlaces() > 12) {
    throw new Error('Maximum 12 decimal places');
  }

  return num;
}
```

### 3. Check for Integer Requirements

```ts
// Good - Explicit check
const num = new PactNumber(value);
if (num.isInteger()) {
  return num.toPactInteger();
} else {
  throw new Error('Integer required');
}

// Alternative - Let toPactInteger throw
try {
  return num.toPactInteger();
} catch (error) {
  throw new Error('Integer required');
}
```

### 4. Use Type Guards for Command Validation

```ts
// Good - Type-safe
if (isSignedCommand(cmd)) {
  await submit(cmd);
}

// Bad - Unsafe cast
await submit(cmd as ICommand);
```

### 5. Chain Operations Efficiently

```ts
// Good - Single chain
const result = new PactNumber('100')
  .plus('10')
  .minus('5')
  .multipliedBy('2')
  .toPactDecimal();

// Less efficient - Multiple instances
const a = new PactNumber('100');
const b = new PactNumber(a.plus('10').toString());
const c = new PactNumber(b.minus('5').toString());
const result = c.multipliedBy('2').toPactDecimal();
```

## Troubleshooting

### Common Issues

#### 1. NaN Error When Creating PactNumber

**Problem:** `Error: Value is NaN`

**Cause:** Invalid number format passed to constructor

**Solution:**
```ts
// Wrong
new PactNumber('abc');
new PactNumber('12.34.56');

// Correct
new PactNumber('123.456');
new PactNumber({ decimal: '123.456' });

// Validate first
function safePactNumber(value: string): PactNumber {
  if (!/^\d+(\.\d+)?$/.test(value)) {
    throw new Error('Invalid number format');
  }
  return new PactNumber(value);
}
```

---

#### 2. "PactNumber is not an integer" Error

**Problem:** Trying to use `toPactInteger()` on a decimal number

**Solution:**
```ts
// Check before converting
const num = new PactNumber('42.5');
if (num.isInteger()) {
  const integer = num.toPactInteger();
} else {
  // Use decimal instead
  const decimal = num.toPactDecimal();
}

// Or use integer value
const integer = num.integerValue(BigNumber.ROUND_DOWN).toPactInteger();
// { int: "42" }
```

---

#### 3. Precision Loss with Large Numbers

**Problem:** Large numbers losing precision

**Solution:**
```ts
// Wrong - Number loses precision
const bigNum = new PactNumber(999999999999999999);

// Correct - String preserves precision
const bigNum = new PactNumber('999999999999999999');
```

---

#### 4. Expression String Formatting Issues

**Problem:** Pact expression not properly formatted

**Solution:**
```ts
// Ensure proper string quoting for string literals
createExp('format', '"Hello {}"', '["World"]');
// "(format \"Hello {}\" [\"World\"])"

// Use JSON.stringify for complex objects
const data = { name: 'Alice', balance: '100' };
createExp('process', JSON.stringify(data));
```

---

#### 5. Signature Validation Failing

**Problem:** `isSignedCommand` returning `false` unexpectedly

**Solution:**
```ts
// Debug signature status
function debugSignatures(cmd: IUnsignedCommand | ICommand) {
  console.log('Total signatures:', cmd.sigs.length);
  cmd.sigs.forEach((sig, i) => {
    console.log(`Sig ${i}:`, sig?.sig ? 'Present' : 'Missing');
  });
}

debugSignatures(transaction);

// Check individual signatures
const allSigned = transaction.sigs.every(s => s?.sig !== undefined);
console.log('All signed:', allSigned);
```

### Getting Help

If you encounter issues:

1. Check the [API Reference](https://github.com/kadena-community/kadena.js/blob/main/packages/libs/pactjs/etc/pactjs.api.md)
2. Review [BigNumber.js documentation](https://mikemcl.github.io/bignumber.js/) for number operations
3. Search [GitHub Issues](https://github.com/kadena-community/kadena.js/issues)
4. Ask in [Discord #kadena-js channel](https://discord.com/channels/502858632178958377/1001088816859336724)

## Related Packages

- **[@kadena/client](../client)**: High-level client for blockchain interactions (uses `@kadena/pactjs`)
- **[@kadena/types](../types)**: TypeScript type definitions
- **[@kadena/cryptography-utils](../cryptography-utils)**: Cryptographic utilities

## Further Reading

- [Pact Language Reference](https://docs.kadena.io/pact)
- [BigNumber.js Documentation](https://mikemcl.github.io/bignumber.js/)
- [Kadena Documentation](https://docs.kadena.io)
