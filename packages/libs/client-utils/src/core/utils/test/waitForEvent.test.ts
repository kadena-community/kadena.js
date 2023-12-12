import { describe, expect, it } from 'vitest';
import { asyncPipe } from '../asyncPipe';
import { waitForEvent } from '../waitForEvent';
import { withEmitter } from '../with-emitter';

describe('waitForEvent', () => {
  it('returns a promise that resolves when the event is emitted', async () => {
    const emitter = withEmitter((emit) =>
      asyncPipe(
        emit('first'),
        (one: string) => `one:${one}`,
        emit('second'),
        (two: string) => `two:${two}`,
        emit('data'),
      ),
    );

    let result = await waitForEvent('second', emitter('test'));
    expect(result).toBe('one:test');

    result = await waitForEvent('first', emitter('test2'));
    expect(result).toBe('test2');

    result = await waitForEvent('data', emitter('test3'));
    expect(result).toBe('two:one:test3');
  });

  it('returns a promise that reject when promise is rejected before the event', async () => {
    const emitter = withEmitter((emit) =>
      asyncPipe(
        emit('first'),
        () => {
          throw new Error('rejected before second event');
        },
        emit('second'),
        (two: string) => `two:${two}`,
        emit('data'),
      ),
    );

    await expect(waitForEvent('second', emitter('test'))).rejects.toThrow(
      new Error('rejected before second event'),
    );
  });
});
