# PactScript

Writing smart contracts in TypeScript/JavaScript

## Motivation

- Using a popular and relatively simple programming language for writing smart
  contracts which makes on boarding developers much easier to the kadena
  blockchain.
- Reduce the need for creates dev tools in favour of using the whole available
  tooling for the language
- Makes pact specific concept easier to understand by removing the need to learn
  new syntax

## Smart Contract

A smart contract is a `class` that extends `PactContract` class. The contract
should define a static member `moduleName` that will be used for deploying
contracts. the contract can use `DataMap` for keeping state and exposes some
public methods to update this state. The smart contract uses `capabilities` to
validate and authorize accessing to the methods.

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

Smart contracts can have three different type of methods

### public methods

theses are the public API that contracts exposes so user can call them via
transactions or in test files.

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

The methods that public methods use internally but they are not accessible in
transactions and test files

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

This is exactly the same as Pact language

A capability is a protected method that is defined with `this.capability`
function and have three purposes

- Validating inputs: the inputs mostly validate inside capabilities and whenever
  something is not valid the capability throws an exception

- Authorization: inside the capability method you also check if the correct user
  requested the function. for example if transfer requested from the owner of
  the account. Also a user can explicitly mention (in the transaction) that he
  expects the contract to grant the capability

- Scoping the transaction access: via managing the state during a tx e.g the
  maximum amount the user allows that be deducted from his account during the
  transaction

```TypeScript
class CoinContract extends PactContract {
  ...

  /**
   * DEBIT capability checks:
   * - the tx signed by the correct user via "enforceGuard" (Authorization)
   * - amount is positive
   * - amount is less than or equal to the account's balance
   * after these check it's safe to update the account balance in the debit method
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

A capability has three phase

### installation

this happens when the capability expects managed values, e.g. max amount the
user want to be deducted from their accounts when calling a method.

the installation could happen from the tx with `caps` field. (or via the code
that guards the account which is not implemented in this POC )

### Granting a capability

This happens when a method calls `grant` function of a capability then the body
of capability will be ran and all validations happen.

### Requiring a capability

This happens by calling `require` method of capability, so it checks if the
capability already granted.

## Test your contract

After creating the contract you can use your favorite testing framework and test
the function, we used vitest in this repo.

The following tests are based of
[CoinContract](./src/examples/coin-contract.ts); you also can check the
[coin.test.ts](./src/examples/tests/coin.test.ts)

### Testing account creation

```TypeScript
it('creates an account and transfer 1 token', () => {
  // define a proper context for the calling tge method
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
  // define a proper context for the calling tge method
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
    ()=>
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
