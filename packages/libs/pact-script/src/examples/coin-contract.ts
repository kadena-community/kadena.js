import type { CapabilityFns, decimal, guard, PactContext } from '../fw';

import {
  DataMap,
  emitEvent,
  enforce,
  enforceGuard,
  exec,
  PactContract,
  step,
  withCapability,
} from '../fw';

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
          'REACHED_MAX_ALLOWED',
          'The requested amount exceeds the maximum allowed',
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

  protected TRANSFER_XCHAIN = this.capability(
    'TRANSFER_XCHAIN',
    (
      sender: string,
      receiver: string,
      amount: decimal,
      targetChain: string,
    ) => {
      this.manage('amount', (managed: number, requested: number) => {
        enforce(
          managed >= requested,
          'REACHED_MAX_ALLOWED',
          'The requested amount exceeds the maximum allowed',
        );
        return managed - requested;
      });
      enforce(
        targetChain !== this.context.chainId,
        'SAME_CHAIN',
        'target chain should not be the same as current chain',
      );
      enforceValidateAccount(receiver);
      this.DEBIT(sender, amount).compose();
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

  private createOrVerifyAccount(account: string, guard: guard) {
    if (this.accounts.has(account)) {
      const dbAccount = this.accounts.get(account);
      enforceSameGuard(guard, dbAccount.guard);
    } else {
      this.createAccount(account, guard);
    }
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
    this.createOrVerifyAccount(receiver, guard);
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

  crossChainTransfer = this.defpact(
    step(
      (
        sender: string,
        receiver: string,
        guard: guard,
        amount: number,
        targetChain: string,
      ) => {
        withCapability(
          this.TRANSFER_XCHAIN(sender, receiver, amount, targetChain),
        );
        this.debit(sender, amount);
        return {
          sourceChain: this.context.chainId,
          sender,
          receiver,
          amount,
          guard,
        };
      },
    ),
    step(({ sourceChain, receiver, guard, amount }) => {
      console.log('sourceChain', sourceChain);
      this.createOrVerifyAccount(receiver, guard);
      emitEvent(this.TRANSFER('', receiver, amount));
      withCapability(this.CREDIT(receiver, amount));
      this.credit(receiver, amount);
      const result = this.credit(receiver, amount);
      return { result };
    }),
  );
}
