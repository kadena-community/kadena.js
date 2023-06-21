const sleep = (duration: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration));

const rejectAfter = async (timeout: number): Promise<void> => {
  if (timeout > 0) {
    await sleep(timeout);
  }
  throw new Error('TIME_OUT_REJECT');
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const retry = <T extends object>(
  task: () => Promise<T>,
  onTry: (count: number) => void,
) =>
  async function runTask(
    timeout: number,
    interval: number,
    count: number = 1,
  ): Promise<T> {
    const startTime = Date.now();
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
      return runTask((timeout = durationTime), interval, count + 1);
    }
  };
