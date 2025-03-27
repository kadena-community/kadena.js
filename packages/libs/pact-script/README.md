# PactScript

Writing smart contracts in TypeScript/JavaScript

## Motivation

- Using a popular and relatively simple programming language for writing smart
  contracts, which makes onboarding developers to the Kadena blockchain much
  easier.
- Reduces the need for creating new development tools by leveraging the existing
  tooling available for the language.
- Simplifies understanding Pact-specific concepts by removing the need to learn
  a new syntax.

## Smart Contract

A smart contract is a `class` that extends the `PactContract` class. The
contract must define a static member `moduleName`, which is used for deploying
contracts. The contract can use `DataMap` to maintain state and expose public
methods to update it. The smart contract uses `capabilities` to validate and
authorize access to its methods.

### Example of a contract

```TypeScript

import { DataMap, enforce, enforceGuard, PactContract } from '@kadena/pact-script';

class CoinContract extends PactContract {
  public static moduleName = 'coin'

  protected accounts = new DataMap({
    guard: PactScheme.any(),
    balance: PactScheme.number().min(0),
  });

  constructor(context: PactContext) {
    super(context);
    this.fundAdmin();
  }

  private fundAdmin() {
    enforce(
      !this.accounts.has('admin'),
      'ADMIN_EXISTS',
      'Admin already exists',
    );

    this.accounts.add('admin', {
      balance: 1000000,
      guard: this.context.getKeyset('admin-ks'),
    });
  }

  getAccountDetails(account: string) {
    return this.accounts.get(account) as { guard: guard; balance: number };
  }

}

```

## Smart Contract Methods

Smart contracts can have three different types of methods.

### public methods

These are the public API methods that the contract exposes, allowing users to
call them via transactions or test files.

```TypeScript
class CoinContract extends PactContract {
  ...
  /**
   * get the account details including balance and guard
   */
  getAccountDetails(account: string) {
    return this.accounts.get(account) as { guard: guard; balance: number };
  }
}

```

### private methods

These are internal methods used by public methods but are not accessible in
transactions or test files.

```TypeScript
class CoinContract extends PactContract {
  ...
  /**
   * the debit function that can be called only via another methods of the contract
   */
  private debit(account: string, amount: decimal) {
    this.DEBIT(account, amount).require();
    const { balance } = this.accounts.get(account);
    return this.accounts.edit(account, { balance: balance - amount });
  }
}

```

### capabilities

A capability is a protected method defined using the `this.capability` function,
serving three main purposes:

- Validating inputs: Inputs are primarily validated within capabilities, and if
  something is not valid, the capability throws an exception.

- Authorization: Inside the capability method, you check if the correct user
  requested the function. For example, you verify if the transfer was requested
  by the owner of the account. Additionally, a user can explicitly mention (in
  the transaction) that they expect the contract to grant the capability.

- Scoping the transaction access: This involves managing the state during a
  transaction, such as the maximum amount the user allows to be deducted from
  their account during the transaction.

```TypeScript
class CoinContract extends PactContract {
  ...

  /**
   * DEBIT capability checks:
   * - the tx signed by the correct user via "enforceGuard" (Authorization)
   * - amount is positive
   * - amount is less than or equal to the account's balance
   * after these checks, it's safe to update the account balance in the debit method
   */
   protected DEBIT = this.capability(
    'DEBIT',
    (sender: string, amount: decimal) => {
      const account = this.accounts.get(sender);
      enforceGuard(account.guard);
      enforce(amount > 0.0, 'INVALID_AMOUNT', 'debit amount must be positive');
      enforce(
        account.balance >= amount,
        'INSUFFICIENT_FUND',
        'Insufficient funds',
      );
    },
  );
}

```

## Capability Phases

A capability has three phases:

### installation

This occurs when the capability expects managed values, such as the maximum
amount the user wants to be deducted from their accounts when calling a method.
The installation could happen from the transaction with the `caps` field (or via
the code that guards the account, which is not implemented in this POC).

### Granting a capability

This happens when a method calls the `grant` function of a capability, at this
point the body of the capability will be executed, and all validations will
occur.

```TypeScript
this.TRANSFER(sender, receiver, amount).grant(()=>{
  // the code
})
```

### Requiring a capability

This happens by calling the `require` method of the capability, which checks if
the capability has already been granted.

```TypeScript
// checks if DEBIT is granted with the arguments
this.DEBIT(account, amount).require();
```

## Test your contract

After creating the contract, you can use your favorite testing framework to test
the function; we used Vitest in this repo.

The following tests are based on
[CoinContract](./src/examples/coin-contract.ts); you can also check the
[coin.test.ts](./src/examples/tests/coin.test.ts).

### Testing account creation

```TypeScript
it('creates an account and transfer 1 token', () => {
  // define a proper context for the calling the method
  const context = new PactContext({
    data: {
      'admin-ks': {
        keys: ['admin-key'],
        pred: 'keys-all',
        signed: true,
        installedCaps: [
          {
            cap: 'coin.TRANSFER',
            args: ['admin', 'k:alice-key:keys-all', 1],
          },
        ],
      },
      'alice-ks': {
        keys: ['alice-key'],
        pred: 'keys-all',
      },
    },
  });
  const contract = CoinContract.create(context);

  expect(
    contract.transferCreate(
      'admin',
      'k:alice-key:keys-all',
      context.getKeyset('alice-ks'),
      1,
    ),
  ).toBe(true);
});
```

### Testing of `ACCOUNT_NOT_FOUND`

```TypeScript
it('Transfer fails if account is not created', () => {
  const context = new PactContext({
    data: {
      'admin-ks': {
        keys: ['admin-key'],
        pred: 'keys-all',
        signed: true,
        installedCaps: [
          {
            cap: 'coin.TRANSFER',
            args: ['admin', 'alice', 1],
          },
        ],
      },
    }
  });
  const contract = CoinContract.create(context);
  expect(() => contract.transfer('admin', 'alice', 1)).toThrow(
    'ACCOUNT_NOT_FOUND',
  );
});


```

### Testing managed capabilities

```TypeScript
it('creates an account and transfer 1 token', () => {
  // define a proper context for the calling the method
  const context = new PactContext({
    data: {
      'admin-ks': {
        keys: ['admin-key'],
        pred: 'keys-all',
        signed: true,
        installedCaps: [
          {
            cap: 'coin.TRANSFER',
            // the signer only allows max 1 token
            args: ['admin', 'k:alice-key:keys-all', 1],
          },
        ],
      },
      'alice-ks': {
        keys: ['alice-key'],
        pred: 'keys-all',
      },
    },
  });
  const contract = CoinContract.create(context);

  expect(
    () =>
      contract.transferCreate(
        'admin',
        'k:alice-key:keys-all',
        context.getKeyset('alice-ks'),
        // requests for 2 tokens
        2,
      )
  ).toThrow('REACHED_MAX_ALLOWED');
});
```
