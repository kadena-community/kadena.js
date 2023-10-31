import { describe, expect, it } from 'vitest';
import { asIterator } from '../asIteraror';
import { asyncPipe } from '../asyncPipe';
import type { IEmit } from '../helpers';

describe('asIterator', () => {
  it('should wrap a pipeline into an async iterator', async () => {
    const testPipeLine = asIterator((emit: IEmit) =>
      asyncPipe(
        emit('start'),
        () => Promise.resolve(1),
        emit('middle'),
        (input) => Promise.resolve(input + 1),
        emit('end'),
      ),
    );
    const step1 = await testPipeLine.next();
    expect(step1).toEqual({
      done: false,
      value: { name: 'start', data: undefined },
    });
    const step2 = await testPipeLine.next();
    expect(step2).toEqual({
      done: false,
      value: { name: 'middle', data: 1 },
    });
    const step3 = await testPipeLine.next();
    expect(step3).toEqual({
      done: false,
      value: { name: 'end', data: 2 },
    });
    const step4 = await testPipeLine.next();
    expect(step4).toEqual({
      done: false,
      value: 2,
    });

    const end = await testPipeLine.next();
    expect(end).toEqual({
      done: true,
      value: undefined,
    });

    const testPipeLine2 = asIterator((emit: IEmit) =>
      asyncPipe(
        emit('start'),
        () => Promise.resolve(1),
        emit('middle'),
        (input) => Promise.resolve(input + 1),
        emit('end'),
      ),
    );

    // use with for await
    for await (const step of testPipeLine2) {
      console.log('step', step);
    }
  });
});
