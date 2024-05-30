interface CoinSchema {
  balance: decimal;
  guard: guard;
}

@namespace('free')
@module('my-coin')
class coin implements fungibleV2, fungibleXChainV1 {
  /**
   * doc can be here
   */
  @governance GOVERNANCE() {
    enforce(false, 'Enforce non-upgradeability');
  }

  @schema('coin-schema') coinSchema = new Schema<CoinSchema>();

  @table('coin-table') coinTable = new Table(this.coinSchema);

  @capability DEBIT(sender: string) {
    enforce_guard(this.coinTable.read(sender).guard);
    enforce(sender !== '', 'valid sender');
  }

  @capability CREDIT(receiver: string) {
    enforce(receiver !== '', 'valid receiver');
  }

  @capability('TRANSFER-mgr') TRANSFER_mgr(
    managed: decimal,
    requested: decimal,
  ): decimal {
    const newbal = managed - requested;
    enforce(
      newbal >= 0.0,
      format('TRANSFER exceeded for balance {}', [managed]),
    );
    return newbal;
  }

  @capability TRANSFER(sender: string, receiver: string, amount: number) {
    managed(amount, this.TRANSFER_mgr);
    enforce(sender !== receiver, 'same sender and receiver');
    enforce_unit(amount);
    enforce(amount > 0.0);
    compose_capability(this.DEBIT(sender));
    compose_capability(this.CREDIT(receiver));
  }

  private debit(account: string, amount: decimal): string {
    validate_account(account);
    enforce(amount > 0.0, 'debit amount must be positive');
    enforce_unit(amount);
    require_capability(this.DEBIT(account));
    const { balance } = this.coinTable.read(account);
    enforce(amount <= balance, 'Insufficient funds');
    return this.coinTable.update(account, { balance: balance - amount });
  }

  private credit(account: string, guard: guard, amount: decimal): string {
    validate_account(account);
    enforce(amount > 0.0, 'credit amount must be positive');
    enforce_unit(amount);
    require_capability(this.CREDIT(account));
    const { balance = -1.0, guard: retg = guard } =
      this.coinTable.read(account);
    enforce(retg === guard, 'account guards do not match');
    const is_new = balance === -1 ? enforce_reserved(account, guard) : false;
    return this.coinTable.write(account, {
      balance: is_new ? amount : balance + amount,
      guard: retg,
    });
  }

  transfer(sender: string, receiver: string, amount: number): string {
    enforce(sender !== receiver, 'same sender and receiver');
    validate_account(sender);
    validate_account(receiver);
    enforce(amount > 0.0);
    enforce_unit(amount);
    return with_capability(this.TRANSFER(sender, receiver, amount), () => {
      this.debit(sender, amount);
      const { guard } = this.coinTable.read(receiver);
      return this.credit(receiver, guard, amount);
    });
  }
}
