import { describe, expect, it } from 'vitest';
import { asyncPipe } from '../asyncPipe';

describe('asyncPipe', () => {
  it('pipes functions together and returns a single function', async () => {
    const asyncAlways = (input: string): Promise<string> =>
      Promise.resolve(input);

    const asyncAppend = (append: string) => (input: string) =>
      Promise.resolve(`${input} ${append}`);

    const appendAsync = asyncPipe(
      asyncAlways,
      asyncAppend('one'),
      asyncAppend('two'),
    );
    const result = await appendAsync('hello');
    expect(result).toEqual('hello one two');
  });

  it('The function takes the same input arguments as the first function and returns the same type as the last one.', async () => {
    const asyncTest = (one: string, two: string): Promise<string> =>
      Promise.resolve(`"${one}-${two}"`);

    const asyncAppend = (append: string) => (input: string) =>
      Promise.resolve(`${input} ${append}`);

    const appendAsync = asyncPipe(
      asyncTest,
      asyncAppend('one'),
      asyncAppend('two'),
    );
    const result = await appendAsync('hello', 'world');
    expect(result).toEqual('"hello-world" one two');
  });
});
