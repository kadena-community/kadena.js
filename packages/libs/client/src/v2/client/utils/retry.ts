import { IPollOptions } from './request';

const sleep = (duration: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration));

const rejectAfter = async (timeout: number): Promise<void> => {
  if (timeout > 0) {
    await sleep(timeout);
  }
  throw new Error('TIME_OUT_REJECT');
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const retry = <T extends object | string>(task: () => Promise<T>) =>
  async function runTask(options?: IPollOptions, count = 0): Promise<T> {
    const startTime = Date.now();

    const {
      onTry = () => {},
      timeout = 1000 * 60 * 3,
      interval = 5000,
    } = options ?? {};

    try {
      onTry(count);
      const result = await Promise.race([task(), rejectAfter(timeout)]);
      return result as T;
    } catch (error) {
      if (error.message === 'TIME_OUT_REJECT') {
        throw error;
      }
      await sleep(interval);
      const durationTime = Date.now() - startTime;
      return runTask(
        { timeout: timeout - durationTime, interval, onTry },
        count + 1,
      );
    }
  };
