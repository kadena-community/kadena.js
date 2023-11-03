import { describe, expect, it, vi } from 'vitest';
import { retry } from '../retry';
import { withCounter } from '../utils';

describe('retry', () => {
  it('should calls the first try without waiting for interval', async () => {
    const task = vi.fn().mockResolvedValue(true);
    const runTask = retry(task);

    const result = await runTask();

    expect(result).toBe(true);
    expect(task).toBeCalledTimes(1);
  });

  it('should retry a task till it returns the result', async () => {
    const task = vi.fn(
      withCounter((idx) => {
        if (idx === 5) return Promise.resolve(true);
        return Promise.reject();
      }),
    );
    const runTask = retry(task);

    const result = await runTask({ interval: 10, timeout: 1000 });

    expect(result).toBe(true);
    expect(task).toBeCalledTimes(5);
  });

  it('throws timeout exception if task does not return value after the timeout', async () => {
    const task = vi.fn(
      withCounter((idx) => {
        if (idx === 5) return Promise.resolve(true);
        return Promise.reject(new Error('its not ready'));
      }),
    );
    const runTask = retry(task);

    const promise = runTask({ interval: 100, timeout: 200 });

    await expect(promise).rejects.toEqual(new Error('TIME_OUT_REJECT'));
  });
});
