import type { decimal, guard, PactContext } from '../fw';

import { DataMap, enforce, enforceGuard, PactContract } from '../fw';

import PactScheme from 'zod';

import {
  enforceReserved,
  enforceSameGuard,
  enforceValidateAccount,
} from './utils';

export class CoinContract extends PactContract {
  public static readonly moduleName: string = 'coin';

  protected accounts = new DataMap({
    guard: PactScheme.any(),
    balance: PactScheme.number().min(0),
  });

  constructor(context: PactContext) {
    super(context);
    this.fundAdmin();
  }

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

  protected CREDIT = this.capability(
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

  protected TRANSFER = this.capability(
    'TRANSFER',
    (sender: string, receiver: string, amount: decimal) => {
      this.manage('amount', (managed: number, requested: number) => {
        enforce(
          managed >= requested,
          'INSUFFICIENT_FUND',
          'Insufficient funds',
        );
        return managed - requested;
      });
      enforce(sender !== receiver, 'SAME_ACCOUNT', 'same sender and receiver');
      this.DEBIT(sender, amount).compose();
      this.CREDIT(receiver, amount).compose();
    },
  );

  protected CREATE_ACCOUNT = this.capability(
    'CREATE_ACCOUNT',
    (account: string, guard: guard) => {
      enforce(
        !this.accounts.has(account),
        'ACCOUNT_EXISTS',
        'Account already exists',
      );
      enforceValidateAccount(account);
      enforceReserved(account, guard);
    },
  );

  protected CHANGE_ADMIN_GUARD = this.capability(
    'CHANGE_ADMIN_GUARD',
    (guard: guard) => {
      const admin = this.accounts.get('admin');
      enforceGuard(admin.guard);
      enforce(
        guard.principal !== admin.guard.principal,
        'SAME_GUARD',
        'same guard',
      );
    },
  );

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

  private debit(account: string, amount: decimal) {
    this.DEBIT(account, amount).require();
    const { balance } = this.accounts.get(account);
    return this.accounts.edit(account, { balance: balance - amount });
  }

  private credit(account: string, amount: decimal) {
    this.CREDIT(account, amount).require();
    const { balance } = this.accounts.get(account);
    return this.accounts.edit(account, { balance: balance + amount });
  }

  createAccount(account: string, guard: guard) {
    return this.CREATE_ACCOUNT(account, guard).grant(() =>
      this.accounts.add(account, { balance: 0, guard }),
    );
  }

  transfer(sender: string, receiver: string, amount: number): true {
    return this.TRANSFER(sender, receiver, amount).grant(() => {
      this.debit(sender, amount);
      this.credit(receiver, amount);
      return true;
    });
  }

  transferCreate(
    sender: string,
    receiver: string,
    guard: guard,
    amount: number,
  ): true {
    if (this.accounts.has(receiver)) {
      const account = this.accounts.get(receiver);
      enforceSameGuard(guard, account.guard);
    } else {
      this.createAccount(receiver, guard);
    }
    return this.transfer(sender, receiver, amount);
  }

  changeAdminGuard(guard: guard) {
    return this.CHANGE_ADMIN_GUARD(guard).grant(() =>
      this.accounts.edit('admin', { guard }),
    );
  }

  getBalance(account: string): decimal {
    return this.accounts.get(account).balance;
  }

  getAccountDetails(account: string) {
    return this.accounts.get(account) as { guard: guard; balance: number };
  }
}
