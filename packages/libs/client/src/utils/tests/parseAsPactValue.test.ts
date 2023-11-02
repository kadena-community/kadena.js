import { describe, expect, it, vi } from 'vitest';
import { parseAsPactValue } from '../parseAsPactValue';

describe('parseType', () => {
  it('parses a decimal number', () => {
    expect(parseAsPactValue({ decimal: '10.1' })).toEqual('10.1');
    expect(parseAsPactValue({ decimal: '10' })).toEqual('10.0');
  });
  it('parses a int number', () => {
    expect(parseAsPactValue({ int: '10' })).toEqual('10');
  });

  it('parses a Date object', () => {
    vi.useFakeTimers();
    const start = new Date('2023-07-20T14:55:11.139Z');
    expect(parseAsPactValue(start)).toEqual(`(time "2023-07-20T14:55:11Z")`);
    vi.useRealTimers();
  });

  it('throws exception if number is not integer', () => {
    expect(() => parseAsPactValue({ int: '10.1' })).toThrowError(
      new Error('PactNumber is not an integer'),
    );
  });

  it('throws exception if value is NaN', () => {
    expect(() => parseAsPactValue({ decimal: 'test' })).toThrowError(
      new Error('Value is NaN'),
    );
  });

  it('throws exception if value is a number', () => {
    expect(() => parseAsPactValue(10)).toThrowError(
      new Error(
        'Type `number` is not allowed in the command. Use `{ decimal: 10 }` or `{ int: 10 }` instead',
      ),
    );
  });

  it('parses a string', () => {
    expect(parseAsPactValue('test')).toEqual('"test"');
  });

  it('call arg, if its a function', () => {
    expect(parseAsPactValue(() => 'test')).toEqual('test');
  });

  it('returns stringified arg, if its an object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseAsPactValue({ test: 'test' } as any)).toBe(
      JSON.stringify({ test: 'test' }),
    );
  });

  it('returns arg, if its a boolean', () => {
    expect(parseAsPactValue(true)).toEqual(true);
  });

  it("returns input, if it doesn't match with any conditions", () => {
    const symbol = Symbol('test');
    expect(parseAsPactValue(symbol as never)).toEqual(symbol);
  });
});
