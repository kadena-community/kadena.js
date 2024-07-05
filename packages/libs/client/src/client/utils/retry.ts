import type { IPollOptions } from '../interfaces/interfaces';
import { sleep } from './utils';

const rejectAfter = (
  timeout: number,
): {
  stopTimer: () => void;
  promise: Promise<void>;
} => {
  let stopTimer = (): void => {};
  const promise = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('TIME_OUT_REJECT')),
      timeout,
    );
    stopTimer = () => clearTimeout(timer);
  });
  return { stopTimer: stopTimer, promise };
};

export const retry = <T extends object | string | void | boolean>(
  task: () => Promise<T>,
) =>
  async function runTask(options?: IPollOptions, count = 0): Promise<T> {
    const startTime = Date.now();

    const { timeout = 1000 * 60 * 3, interval = 5000 } = options ?? {};

    const rejectTimer = rejectAfter(timeout);

    try {
      const result = await Promise.race([
        rejectTimer.promise,
        // sleep for 1ms to let the timeout promise reject first.
        sleep(1)
          .then(task)
          .finally(() => {
            // stop the timer if the task already fulfilled
            rejectTimer.stopTimer();
          }),
      ]);
      return result as T;
    } catch (error) {
      if (error !== undefined && error.message === 'TIME_OUT_REJECT') {
        throw error;
      }

      await sleep(interval);
      const durationTime = Date.now() - startTime;
      return runTask({ timeout: timeout - durationTime, interval }, count + 1);
    }
  };
