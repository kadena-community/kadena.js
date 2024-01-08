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

  it('return the same promise if execute is called twice', async () => {
    const emitter = withEmitter((emit) => emit('data'));

    const result = emitter('test');

    const prOne = result.execute();
    const prTwo = result.execute();

    expect(prOne === prTwo).toBe(true);
  });

  it("returns an iterator with execute function that accepts the event and returns the event's data", async () => {
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

    const second = await iterator.executeTo('second');
    expect(second).toBe('one:test');

    const data = await iterator.executeTo('data');
    expect(data).toBe('two:one:test');
  });

  it('the process should pause between two `execute` functions', async () => {
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

    const second = await iterator.executeTo('second');
    expect(second).toBe('one:test');

    // sleep for 100ms to make sure the data event is not triggered without calling execute
    await sleep(100);

    const data = await iterator.executeTo('data');
    expect(data).toBe('two:one:test');
  });

  it('returns final result if no event is passed to execute', async () => {
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

    const second = await iterator.executeTo('second');
    expect(second).toBe('one:test');

    const data = await iterator.execute();
    expect(data).toBe(2);
  });

  it('returns the same result (from cache) if call an event twice', async () => {
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

    const second = await iterator.executeTo('second');
    expect(second).toBe('one:test');

    const secondTwice = await iterator.executeTo('second');
    expect(second).toBe(secondTwice);
  });

  it('start from specific step', async () => {
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

    const iterator = emitter.from('second', 'from-step');

    const second = await iterator.executeTo('data');
    expect(second).toBe('two:from-step');
  });
});
