import type { decimal, guard, PactContext } from '../fw';

import { DataMap, enforce, enforceGuard, PactContract } from '../fw';

import PactScheme from 'zod';

import {
  enforceReserved,
  enforceSameGuard,
  enforceValidateAccount,
} from './utils';

export class CoinContract extends PactContract {
  /**
   * The module name of the contract.
   * This will be used to deploy the contract also checking installed capabilities.
   */
  public static readonly moduleName: string = 'coin';

  /**
   * The accounts data map. This will store the account details.
   * This is a key-value pair where the key is the account name and the value is the account details.
   * in the transpile time we will generate schema and pact table for this data map.
   */
  protected accounts = new DataMap({
    guard: PactScheme.any(),
    balance: PactScheme.number().min(0),
  });

  /**
   *
   * the constructor of the contract that will be called when the contract is deployed.
   * also this will be called when the contract is created in the test.
   */
  constructor(context: PactContext) {
    super(context);
    this.fundAdmin();
  }

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

  /**
   * CREDIT capability checks:
   * - The target account exists
   * - amount is positive
   * after these check it's safe to update the account balance in the credit method
   */
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

  /**
   * TRANSFER capability checks:
   * - sender and receiver are not the same
   * - amount is less than or equal to the installed balance
   * - call DEBIT and CREDIT capabilities which will check the rest of the conditions
   * after these check it's safe to update the accounts in the transfer method
   */
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

  /**
   * CREATE_ACCOUNT capability checks:
   * - account does not exist
   * - account name is valid
   * - account name is not reserved
   * after these check it's safe to add the account in the createAccount
   */
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

  /**
   * CHANGE_ADMIN_GUARD capability checks:
   * - the new guard is not the same as the current admin guard
   * - call enforceGuard to check the tx is signed by the correct user
   * after these check it's safe to update the admin guard in the changeAdminGuard method
   */
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

  /**
   * fund the admin account with 1,000,000 KDA
   * this will be called in the constructor
   * this is a private method so
   * it's not possible to call this method from the outside
   */
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

  /**
   * debit the account with the amount
   * This first checks the DEBIT capability is granted
   * then it will update the account balance
   * this is a private method and will be called in the transfer method
   */
  private debit(account: string, amount: decimal) {
    this.DEBIT(account, amount).require();
    const { balance } = this.accounts.get(account);
    return this.accounts.edit(account, { balance: balance - amount });
  }

  /**
   * credit the account with the amount
   * This first checks the CREDIT capability is granted
   * then it will update the account balance
   * this is a private method and will be called in the transfer method
   */
  private credit(account: string, amount: decimal) {
    this.CREDIT(account, amount).require();
    const { balance } = this.accounts.get(account);
    return this.accounts.edit(account, { balance: balance + amount });
  }

  /**
   * create an account with the initial balance of 0
   * This first tries to grant CREATE_ACCOUNT capability (so all validation happens)
   * then it will add the account to the accounts data map
   */
  createAccount(account: string, guard: guard) {
    return this.CREATE_ACCOUNT(account, guard).grant(() =>
      this.accounts.add(account, { balance: 0, guard }),
    );
  }
  /**
   * transfer the amount from sender to receiver
   * This first tries to grant TRANSFER capability (so all validation happens)
   * then it will calls the debit and credit methods to update the account balances
   */
  transfer(sender: string, receiver: string, amount: number): true {
    return this.TRANSFER(sender, receiver, amount).grant(() => {
      this.debit(sender, amount);
      this.credit(receiver, amount);
      return true;
    });
  }

  /**
   * create an account with the initial balance of 0 if its not exist
   * check the receiver account guard if it already exists
   * transfer the amount from sender to receiver by calling the transfer method
   */
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

  /**
   * tries to grant the CHANGE_ADMIN_GUARD capability
   * then it will update the admin guard
   */
  changeAdminGuard(guard: guard) {
    return this.CHANGE_ADMIN_GUARD(guard).grant(() =>
      this.accounts.edit('admin', { guard }),
    );
  }

  /**
   * get the balance of the account
   */
  getBalance(account: string): decimal {
    return this.accounts.get(account).balance;
  }

  /**
   * get the account details including the guard and balance
   */
  getAccountDetails(account: string) {
    return this.accounts.get(account) as { guard: guard; balance: number };
  }
}
