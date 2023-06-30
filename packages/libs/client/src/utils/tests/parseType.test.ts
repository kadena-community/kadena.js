import { parseType } from '../parseType';

describe('parseType', () => {
  it('parses a decimal number', () => {
    expect(parseType({ decimal: '10.1' })).toEqual('10.1');
    expect(parseType({ decimal: '10' })).toEqual('10.0');
  });
  it('parses a int number', () => {
    expect(parseType({ int: '10' })).toEqual('10');
  });

  it('throws exception if number is not integer', () => {
    expect(() => parseType({ int: '10.1' })).toThrowError(
      new Error('PactNumber is not an integer'),
    );
  });

  it('throws exception if value is NaN', () => {
    expect(() => parseType({ decimal: 'test' })).toThrowError(
      new Error('Value is NaN'),
    );
  });

  it('throws exception if value is a number', () => {
    expect(() => parseType(10)).toThrowError(
      new Error(
        'Type `number` is not allowed in the command. Use `{ decimal: 10 }` or `{ int: 10 }` instead',
      ),
    );
  });

  it('parses a string', () => {
    expect(parseType('test')).toEqual('"test"');
  });

  it('call arg, if its a function', () => {
    expect(parseType(() => 'test')).toEqual('test');
  });

  it('returns arg, if its an object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseType({ test: 'test' } as any)).toEqual({ test: 'test' });
  });

  it('returns arg, if its a boolean', () => {
    expect(parseType(true)).toEqual(true);
  });
});
