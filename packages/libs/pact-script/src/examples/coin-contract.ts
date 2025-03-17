import type { decimal, guard } from './fw';

import {
  DataMap,
  enforce,
  enforceGuard,
  environment,
  PactContract,
} from './fw';

import PactScheme from 'zod';

import { enforceReserved, enforceValidateAccount } from './utils';

export class CoinContract extends PactContract {
  private accounts = new DataMap({
    guard: PactScheme.string(),
    balance: PactScheme.number().min(0),
  });

  constructor() {
    super();
    this.accounts.add('admin', {
      balance: 1000000,
      guard: JSON.stringify(environment.getKeyset('admin')),
    });
  }

  private DEBIT = this.capability(
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

  private CREDIT = this.capability(
    'CREDIT',
    (receiver: string, amount: decimal) => {
      enforce(
        this.accounts.has(receiver),
        'ACCOUNT_NOT_FOUND',
        `Account not found: ${receiver}`,
      );

      enforce(amount > 0.0, 'INVALID_AMOUNT', 'debit amount must be positive');
    },
  );

  TRANSFER = this.capability(
    'TRANSFER',
    (sender: string, receiver: string, amount: decimal) => {
      enforce(sender !== receiver, 'SAME_ACCOUNT', 'same sender and receiver');
      this.DEBIT(sender, amount).compose();
      this.CREDIT(receiver, amount).compose();
    },
  );

  CREATE_ACCOUNT = this.capability(
    'CREATE_ACCOUNT',
    (account: string, guard: guard) => {
      enforce(
        !this.accounts.has(account),
        'ACCOUNT_EXISTS',
        'Account already exists',
      );
      enforce(account !== '', 'EMPTY_ACCOUNT', 'account name cannot be empty');
      enforceValidateAccount(account);
      enforceReserved(account, guard);
    },
  );

  private debit(account: string, amount: decimal): string {
    this.DEBIT(account, amount).require();
    const { balance } = this.accounts.get(account);
    return this.accounts.edit(account, { balance: balance - amount });
  }

  private credit(account: string, amount: decimal): string {
    this.CREDIT(account, amount).require();
    const { balance } = this.accounts.get(account);
    return this.accounts.edit(account, {
      balance: balance + amount,
    });
  }

  createAccount(account: string, guard: guard): string {
    return this.CREATE_ACCOUNT(account, guard).grant(() =>
      this.accounts.add(account, { balance: 0, guard }),
    );
  }

  transfer(sender: string, receiver: string, amount: number): string {
    return this.TRANSFER(sender, receiver, amount).grant(() => {
      this.debit(sender, amount);
      this.credit(receiver, amount);
      return 'TRANSFER_SUCCESS';
    });
  }

  transferCreate(
    sender: string,
    receiver: string,
    guard: guard,
    amount: number,
  ): string {
    if (!this.accounts.has(receiver)) {
      this.createAccount(receiver, guard);
    } else {
      const { guard: existingGuard } = this.accounts.get(receiver);
      enforce(existingGuard === guard, 'GUARD_MISMATCH', 'Guard mismatch');
    }
    return this.TRANSFER(sender, receiver, amount).grant(() => {
      this.debit(sender, amount);
      this.credit(receiver, amount);
      return 'TRANSFER_SUCCESS';
    });
  }

  getBalance(account: string): decimal {
    return this.accounts.get(account).balance;
  }

  getAccountDetails(account: string): {
    guard: string;
    balance: number;
  } {
    return this.accounts.get(account);
  }
}
