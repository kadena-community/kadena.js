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
        'Type `number` is not allowed in the command. Use `{ decimal: "10.0" }` or `{ int: "10" }` instead',
      ),
    );
  });

  it('parses a string', () => {
    expect(parseAsPactValue('test')).toEqual('"test"');
  });

  it('call arg, if its a function', () => {
    expect(parseAsPactValue(() => 'test')).toEqual('test');
  });

  it('parse object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseAsPactValue({ test: { decimal: '2' } } as any)).toEqual(
      '{"test": 2.0}',
    );
  });

  it('return "true" or "false", if its a boolean', () => {
    expect(parseAsPactValue(true)).toEqual('true');
    expect(parseAsPactValue(false)).toEqual('false');
  });

  it("returns input, if it doesn't match with any conditions", () => {
    const symbol = Symbol('test');
    expect(parseAsPactValue(symbol as never)).toEqual(symbol);
  });

  // it('parses an nested object with nested pact values', () => {});
  it('parses an array with nested pact values', () => {
    const start = new Date('2023-07-20T14:55:11.139Z');
    expect(
      parseAsPactValue([start, start, { decimal: '1' }, { int: '1' }]),
    ).toEqual(
      '[(time "2023-07-20T14:55:11Z") (time "2023-07-20T14:55:11Z") 1.0 1]',
    );
  });

  it('parses an object with nested pact values', () => {
    const start = new Date('2023-07-20T14:55:11.139Z');
    expect(
      parseAsPactValue({
        object: {
          start,
          end: start,
          test: { x: { decimal: '1' }, y: { int: '1' } },
        },
        simpleArray: [{ decimal: '1' }, { int: '1' }],
        arrayOfObject: [
          {
            time: {
              start,
              end: start,
              test: { x: { decimal: '1' }, y: { int: '1' } },
            },
          },
        ],
      }),
    ).toEqual(
      '{"object": {"start": (time "2023-07-20T14:55:11Z"), "end": (time "2023-07-20T14:55:11Z"), "test": {"x": 1.0, "y": 1}}, "simpleArray": [1.0 1], "arrayOfObject": [{"time": {"start": (time "2023-07-20T14:55:11Z"), "end": (time "2023-07-20T14:55:11Z"), "test": {"x": 1.0, "y": 1}}}]}',
    );
  });
});
