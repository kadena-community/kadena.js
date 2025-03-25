import type { decimal, guard, PactContext } from './fw';

import { DataMap, enforce, enforceGuard, manage, PactContract } from './fw';

import PactScheme from 'zod';

import { enforceReserved, enforceValidateAccount } from './utils';

export class CoinContract extends PactContract {
  // the map for storing account details
  private accounts = new DataMap({
    guard: PactScheme.any(),
    balance: PactScheme.number().min(0),
  });

  constructor(context: PactContext) {
    super(context);
    this.fundAdmin();
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

  private TRANSFER = this.capability(
    'TRANSFER',
    (sender: string, receiver: string, amount: decimal) => {
      manage('amount', (managed: number, requested: number) => {
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

  private CREATE_ACCOUNT = this.capability(
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

  private CHANGE_ADMIN_GUARD = this.capability(
    'CHANGE_ADMIN_GUARD',
    (guard: guard) => {
      const admin = this.accounts.get('admin');
      enforce(
        guard.principal !== admin.guard.principal,
        'SAME_GUARD',
        'same guard',
      );
      enforceGuard(admin.guard);
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
  ): true {
    if (!this.accounts.has(receiver)) {
      this.createAccount(receiver, guard);
    } else {
      const { guard: existingGuard } = this.accounts.get(receiver);
      enforce(
        existingGuard.principal === guard.principal,
        'GUARD_MISMATCH',
        `Guard mismatch ${existingGuard.principal} !== ${guard.principal}`,
      );
    }
    return this.TRANSFER(sender, receiver, amount).grant(() => {
      this.debit(sender, amount);
      this.credit(receiver, amount);
      return true;
    });
  }

  changeAdminGuard(guard: guard) {
    return this.CHANGE_ADMIN_GUARD(guard).grant(() => {
      this.accounts.edit('admin', { guard });
      return true;
    });
  }

  getBalance(account: string): decimal {
    return this.accounts.get(account).balance;
  }

  getAccountDetails(account: string) {
    return this.accounts.get(account) as { guard: guard; balance: number };
  }
}
