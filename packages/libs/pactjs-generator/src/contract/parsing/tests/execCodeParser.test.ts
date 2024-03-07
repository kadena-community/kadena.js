import { describe, expect, it } from 'vitest';
import { execCodeParser } from '../execCodeParser';

describe('execCodeParser', () => {
  it('parses pact code', () => {
    const code =
      '(coin.transfer "alice" "bob" 100)(free.my-contract.my-function "alice" "bob" [100.1 2] { "extra" : "some-data" } )';
    const parsed = execCodeParser(code);
    expect(parsed).toEqual([
      {
        function: { module: 'coin', name: 'transfer' },
        args: [{ string: 'alice' }, { string: 'bob' }, { int: '100' }],
      },
      {
        function: {
          namespace: 'free',
          module: 'my-contract',
          name: 'my-function',
        },
        args: [
          { string: 'alice' },
          { string: 'bob' },
          { list: [{ decimal: '100.1' }, { int: '2' }] },
          { object: [{ property: 'extra', value: { string: 'some-data' } }] },
        ],
      },
    ]);
  });

  it('returns undefined if code is not parsable - mismatch parenthesis', () => {
    // missing closing parenthesis
    const code = '(coin.transfer "alice" "bob" 100';
    const parsed = execCodeParser(code);
    expect(parsed).toEqual(undefined);
  });

  it('returns undefined if code is not parsable - invalid arg', () => {
    // atom as argument
    const code = '(coin.transfer alice "bob" 100';
    const parsed = execCodeParser(code);
    expect(parsed).toEqual(undefined);
  });
});
