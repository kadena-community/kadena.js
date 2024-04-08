@namespace('free')
class coin implements fungible_v2, fungible_xchain_v1 {
  @governance GOVERNANCE() {
    enforce(false, 'Enforce non-upgradeability');
  }

  coin_scheme = defscheme({
    balance: 'decimal',
    guard: 'guard',
  });

  coin_table = deftable(this.coin_scheme);

  @defcap DEBIT(sender: string) {
    // "Capability for managing debiting operations"
    enforce_guard(read('coin-table', sender).guard);
    enforce(sender != '', 'valid sender');
  }

  @defcap CREDIT(receiver: string) {
    // Capability for managing crediting operations
    enforce(receiver != '', 'valid receiver');
  }

  @defcap TRANSFER_mgr(managed: decimal, requested: decimal): decimal {
    const newbal = managed - requested;
    enforce(
      newbal >= 0.0,
      format('TRANSFER exceeded for balance {}', [managed]),
    );
    return newbal;
  }

  @defcap TRANSFER(sender: string, receiver: string, amount: number) {
    managed(amount, this.TRANSFER_mgr);
    enforce(sender != receiver, 'same sender and receiver');
    enforce_unit(amount);
    enforce(amount > 0.0);
    compose_capability(this.DEBIT(sender));
    compose_capability(this.CREDIT(receiver));
  }

  debit(account: string, amount: decimal): string {
    validate_account(account);
    enforce(amount > 0.0, 'debit amount must be positive');
    enforce_unit(amount);
    require_capability(this.DEBIT(account));
    const { balance } = this.coin_table.read(account);
    enforce(amount <= balance, 'Insufficient funds');
    return update('coin-table', account, { balance: balance - amount });
  }

  credit(account: string, guard: guard, amount: decimal): string {
    validate_account(account);
    enforce(amount > 0.0, 'credit amount must be positive');
    enforce_unit(amount);
    require_capability(this.CREDIT(account));
    const { balance = -1.0, guard: retg = guard } =
      this.coin_table.read(account);
    enforce(retg === guard, 'account guards do not match');
    const is_new = balance === -1 ? enforce_reserved(account, guard) : false;
    return this.coin_table.write(account, {
      balance: is_new ? amount : balance + amount,
      guard: retg,
    });
  }

  transfer(sender: string, receiver: string, amount: number): string {
    enforce(sender != receiver, 'same sender and receiver');
    validate_account(sender);
    validate_account(receiver);
    enforce(amount > 0.0);
    enforce_unit(amount);
    return with_capability(this.TRANSFER(sender, receiver, amount), () => {
      this.debit(sender, amount);
      const { guard } = this.coin_table.read(receiver);
      return this.credit(receiver, guard, amount);
    });
  }
}
