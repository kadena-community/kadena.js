import { describe, expect, it } from 'vitest';
import { asIterator } from '../asIteraror';
import { asyncPipe } from '../asyncPipe';
import type { IEmit } from '../helpers';

describe('asIterator', () => {
  it('should wrap a pipeline into an async iterator', async () => {
    const testPipeLine = asIterator((emit: IEmit) =>
      asyncPipe(
        emit('start'),
        (a) => Promise.resolve(1 + a),
        emit('middle'),
        (b) => Promise.resolve(b + 1),
        emit('end'),
      ),
    );
    const firstInstance = testPipeLine(0);
    const step1 = await firstInstance.next();
    expect(step1).toEqual({
      done: false,
      value: { name: 'start', data: 0 },
    });
    const step2 = await firstInstance.next();
    expect(step2).toEqual({
      done: false,
      value: { name: 'middle', data: 1 },
    });
    const step3 = await firstInstance.next();
    expect(step3).toEqual({
      done: false,
      value: { name: 'end', data: 2 },
    });
    const step4 = await firstInstance.next();
    expect(step4).toEqual({
      done: false,
      value: 2,
    });

    const end = await firstInstance.next();
    expect(end).toEqual({
      done: true,
      value: undefined,
    });

    const secondInstance = testPipeLine(2);

    // use with for await
    for await (const step of secondInstance) {
      console.log('step', step);
    }
  });
});
