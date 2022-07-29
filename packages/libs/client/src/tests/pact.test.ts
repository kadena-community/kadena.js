import { IUnsignedTransaction } from '../interfaces/IUnsignedTransaction';
import { Pact } from '../pact';

function getCode(transaction: IUnsignedTransaction): string {
  return JSON.parse(transaction.cmd).payload.exec.code;
}

describe('Pact proxy', () => {
  it('creates an instance of the proxy', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pact = Pact as any;
    const tx = pact.modules.coin
      .transfer('alice', 'bob', 100)
      .createTransaction();
    expect(getCode(tx)).toBe('(coin.transfer "alice" "bob" 100.0)');
  });

  it('generates two different commands when executed after each other', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pact = Pact as any;

    const tx = pact.modules.coin
      .transfer('alice', 'bob', 100)
      .createTransaction();

    const tx2 = pact.modules.coin
      .transfer('bob', 'alice', 100)
      .createTransaction();

    expect(getCode(tx)).toBe('(coin.transfer "alice" "bob" 100.0)');
    expect(getCode(tx2)).toBe('(coin.transfer "bob" "alice" 100.0)');
  });

  it('generates two different commands when generated asynchronously', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pact = Pact as any;
    const tx = pact.modules.coin
      .transfer('alice', 'bob', 100)
      .createTransaction();
    const tx2 = pact.modules.coin['transfer-xchain'](
      'k:1',
      'k:1',
      'chain1',
      'chain2',
      100,
    ).createTransaction();

    expect(getCode(tx2)).toBe(
      '(coin.transfer-xchain "k:1" "k:1" "chain1" "chain2" 100.0)',
    );
    expect(getCode(tx)).toBe('(coin.transfer "alice" "bob" 100.0)');
  });
});
