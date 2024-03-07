import { describe, expect, it } from 'vitest';
import { unwrapData } from '../dataWrapper';
import { functionCallParser } from '../functionCallParser';
import { getPointer } from '../getPointer';
import { FAILED } from '../parser-utilities';

describe('functionCallParser', () => {
  it('parses pact code', () => {
    const pointer = getPointer('(read-keyset "guard")');
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual({
      codes: [
        { function: { name: 'read-keyset' }, args: [{ string: 'guard' }] },
      ],
    });
  });

  it('parses function with module name', () => {
    const pointer = getPointer('(my-module.func "guard")');
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual({
      codes: [
        {
          function: { module: 'my-module', name: 'func' },
          args: [{ string: 'guard' }],
        },
      ],
    });
  });

  it('parses function with module name and namespace', () => {
    const pointer = getPointer('(my-namespace.my-module.func "guard")');
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual({
      codes: [
        {
          function: {
            namespace: 'my-namespace',
            module: 'my-module',
            name: 'func',
          },
          args: [{ string: 'guard' }],
        },
      ],
    });
  });

  it('should extract data from pact code', () => {
    const pointer = getPointer(
      '(coin.transfer "alice" "bob" 100)(free.my-coin.transfer "alice" "bob" 100.1)',
    );
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual({
      codes: [
        {
          function: { module: 'coin', name: 'transfer' },
          args: [{ string: 'alice' }, { string: 'bob' }, { int: '100' }],
        },
        {
          function: { namespace: 'free', module: 'my-coin', name: 'transfer' },
          args: [{ string: 'alice' }, { string: 'bob' }, { decimal: '100.1' }],
        },
      ],
    });
  });

  it('reruns FAILED if parenthesis mismatch', () => {
    const pointer = getPointer('(coin.transfer "alice" "bob" 100');
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual(FAILED);
  });

  it('reruns FAILED if function name missing', () => {
    const pointer = getPointer('("alice" "bob" 100)');
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual(FAILED);
  });

  it('parses a function call with object argument', () => {
    const pointer = getPointer(
      '(coin.test "alice" "bob" {"one": "1", "second": "2"})',
    );
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual({
      codes: [
        {
          function: { module: 'coin', name: 'test' },
          args: [
            { string: 'alice' },
            { string: 'bob' },
            {
              object: [
                { property: 'one', value: { string: '1' } },
                { property: 'second', value: { string: '2' } },
              ],
            },
          ],
        },
      ],
    });
  });

  it('parses a function call with list argument', () => {
    const pointer = getPointer('(my-module.test "alice" "bob" [100 200])');
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual({
      codes: [
        {
          function: { module: 'my-module', name: 'test' },
          args: [
            { string: 'alice' },
            { string: 'bob' },
            { list: [{ int: '100' }, { int: '200' }] },
          ],
        },
      ],
    });
  });

  it('parses a function that uses pact code as argument', () => {
    const pointer = getPointer(
      '(transfer-create "sender-account" "receiver-account" (read-keyset "guard") 10.1)',
    );
    const result = functionCallParser(pointer);
    const data = unwrapData(result);
    expect(data).toEqual({
      codes: [
        {
          function: { name: 'transfer-create' },
          args: [
            { string: 'sender-account' },
            { string: 'receiver-account' },
            {
              code: {
                function: { name: 'read-keyset' },
                args: [{ string: 'guard' }],
              },
            },
            { decimal: '10.1' },
          ],
        },
      ],
    });
  });
});
