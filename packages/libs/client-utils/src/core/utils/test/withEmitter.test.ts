import { describe, expect, it } from 'vitest';

import { asyncPipe } from '../asyncPipe';
import { withEmitter } from '../with-emitter';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  it('throws an exception if the execute is called twice', async () => {
    const emitter = withEmitter((emit) => emit('data'));

    const result = emitter('test');

    await result.execute();

    await expect(() => result.execute()).rejects.toThrow(
      new Error('execute can only be called once'),
    );
  });

  it("returns an iterator with next function that accepts the event and returns the event's data", async () => {
    const emitter = withEmitter((emit) =>
      asyncPipe(
        emit('first'),
        (one: string) => `one:${one}`,
        emit('second'),
        (two: string) => `two:${two}`,
        emit('data'),
      ),
    );

    const iterator = emitter('test');

    const second = await iterator.next('second');
    expect(second).toBe('one:test');

    const data = await iterator.next('data');
    expect(data).toBe('two:one:test');
  });

  it('the process should pause between two `next` functions', async () => {
    const emitter = withEmitter((emit) =>
      asyncPipe(
        emit('first'),
        (one: string) => `one:${one}`,
        emit('second'),
        (two: string) => `two:${two}`,
        emit('data'),
        (two: string) => 2,
        emit('datas'),
      ),
    );

    const iterator = emitter('test');

    const second = await iterator.next('second');
    expect(second).toBe('one:test');

    // sleep for 100ms to make sure the data event is not triggered without calling next
    await sleep(100);

    const data = await iterator.next('data');
    expect(data).toBe('two:one:test');
  });
});
