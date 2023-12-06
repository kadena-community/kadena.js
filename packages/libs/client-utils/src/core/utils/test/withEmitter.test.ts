import { describe, expect, it } from 'vitest';

import { asyncPipe } from '../asyncPipe';
import { withEmitter } from '../with-emitter';

describe('withEmitter', () => {
  it('wrap a function as emitter', async () => {
    const emitter = withEmitter((emit) =>
      asyncPipe(
        emit('start'),
        (input: string) => `input:${input}`,
        emit('end'),
      ),
    );

    const result = emitter('test');

    expect(result.on).toBeDefined();
    expect(result.execute).toBeDefined();
    await expect(result.execute()).resolves.toBe('input:test');
  });

  it('triggers the events based on the possition in asyncPipe with the input', async () => {
    const emitter = withEmitter((emit) =>
      asyncPipe(
        emit('first'),
        (one: string) => `one:${one}`,
        emit('second'),
        (two: string) => `two:${two}`,
        emit('data'),
      ),
    );

    const result = emitter('test')
      .on('first', (data) => {
        expect(data).toBe('test');
      })
      .on('second', (data) => {
        expect(data).toBe('one:test');
      })
      .on('data', (data) => {
        expect(data).toBe('two:one:test');
      });

    await expect(result.execute()).resolves.toBe('two:one:test');
  });
});
