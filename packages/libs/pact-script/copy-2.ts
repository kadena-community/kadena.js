const GOVERNANCE = defGovernance(() => {
  enforce(false, 'Enforce non-upgradeability');
});

export const module = defModule({
  namespace: 'free',
  name: 'coin',
  governance: GOVERNANCE,
  extends: ['fungible_v2', 'fungible_xchain_v1'],
});

const coin_scheme = createScheme({
  balance: 'decimal',
  guard: 'guard',
});

const coin_table = createTable(coin_scheme);

const DEBIT = defCap((sender: string) => {
  'Capability for managing debiting operations';
  enforce_guard(read('coin-table', sender).guard);
  enforce(sender != '', 'valid sender');
});

const CREDIT = defCap((receiver: string) => {
  'Capability for managing crediting operations';
  enforce(receiver != '', 'valid receiver');
});

const TRANSFER_mgr = defCap((managed: decimal, requested: decimal): decimal => {
  const newbal = managed - requested;
  enforce(newbal >= 0.0, format('TRANSFER exceeded for balance {}', [managed]));
  return newbal;
});

const TRANSFER = defCap((sender: string, receiver: string, amount: number) => {
  managed(amount, TRANSFER_mgr);
  enforce(sender != receiver, 'same sender and receiver');
  enforce_unit(amount);
  enforce(amount > 0.0);
  compose_capability(DEBIT(sender));
  compose_capability(CREDIT(receiver));
});

export function debit(account: string, amount: decimal): string {
  validate_account(account);
  enforce(amount > 0.0, 'debit amount must be positive');
  enforce_unit(amount);
  require_capability(DEBIT(account));
  const { balance } = coin_table.read(account);
  enforce(amount <= balance, 'Insufficient funds');
  return update('coin-table', account, { balance: balance - amount });
}

export function credit(account: string, guard: guard, amount: decimal): string {
  validate_account(account);
  enforce(amount > 0.0, 'credit amount must be positive');
  enforce_unit(amount);
  require_capability(CREDIT(account));
  const { balance = -1.0, guard: retg = guard } = coin_table.read(account);
  enforce(retg === guard, 'account guards do not match');
  const is_new = balance === -1 ? enforce_reserved(account, guard) : false;
  return coin_table.write(account, {
    balance: is_new ? amount : balance + amount,
    guard: retg,
  });
}

export function transfer(
  sender: string,
  receiver: string,
  amount: number,
): string {
  enforce(sender != receiver, 'same sender and receiver');
  validate_account(sender);
  validate_account(receiver);
  enforce(amount > 0.0);
  enforce_unit(amount);
  return with_capability(TRANSFER(sender, receiver, amount), () => {
    debit(sender, amount);
    const { guard } = coin_table.read(receiver);
    return credit(receiver, guard, amount);
  });
}

function Coin() {
  const GOVERNANCE = defGovernance(() => {
    enforce(false, 'Enforce non-upgradeability');
  });

  const module = defModule({
    namespace: 'free',
    name: 'coin',
    governance: GOVERNANCE,
    extends: ['fungible_v2', 'fungible_xchain_v1'],
  });

  const coin_scheme = createScheme({
    balance: 'decimal',
    guard: 'guard',
  });

  const coin_table = createTable(coin_scheme);

  const DEBIT = defCap((sender: string) => {
    'Capability for managing debiting operations';
    enforce_guard(read('coin-table', sender).guard);
    enforce(sender != '', 'valid sender');
  });

  const CREDIT = defCap((receiver: string) => {
    'Capability for managing crediting operations';
    enforce(receiver != '', 'valid receiver');
  });

  const TRANSFER_mgr = defCap(
    (managed: decimal, requested: decimal): decimal => {
      const newbal = managed - requested;
      enforce(
        newbal >= 0.0,
        format('TRANSFER exceeded for balance {}', [managed]),
      );
      return newbal;
    },
  );

  const TRANSFER = defCap(
    (sender: string, receiver: string, amount: number) => {
      managed(amount, TRANSFER_mgr);
      enforce(sender != receiver, 'same sender and receiver');
      enforce_unit(amount);
      enforce(amount > 0.0);
      compose_capability(DEBIT(sender));
      compose_capability(CREDIT(receiver));
    },
  );

  export function debit(account: string, amount: decimal): string {
    validate_account(account);
    enforce(amount > 0.0, 'debit amount must be positive');
    enforce_unit(amount);
    require_capability(DEBIT(account));
    const { balance } = coin_table.read(account);
    enforce(amount <= balance, 'Insufficient funds');
    return update('coin-table', account, { balance: balance - amount });
  }

  export function credit(
    account: string,
    guard: guard,
    amount: decimal,
  ): string {
    validate_account(account);
    enforce(amount > 0.0, 'credit amount must be positive');
    enforce_unit(amount);
    require_capability(CREDIT(account));
    const { balance = -1.0, guard: retg = guard } = coin_table.read(account);
    enforce(retg === guard, 'account guards do not match');
    const is_new = balance === -1 ? enforce_reserved(account, guard) : false;
    return coin_table.write(account, {
      balance: is_new ? amount : balance + amount,
      guard: retg,
    });
  }

  export function transfer(
    sender: string,
    receiver: string,
    amount: number,
  ): string {
    enforce(sender != receiver, 'same sender and receiver');
    validate_account(sender);
    validate_account(receiver);
    enforce(amount > 0.0);
    enforce_unit(amount);
    return with_capability(TRANSFER(sender, receiver, amount), () => {
      debit(sender, amount);
      const { guard } = coin_table.read(receiver);
      return credit(receiver, guard, amount);
    });
  }
}
