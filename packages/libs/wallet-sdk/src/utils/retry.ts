export const retry = async <T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  options: {
    maxRetries: number;
    delayMs: number;
    signal?: AbortSignal;
  } = {
    maxRetries: 120,
    delayMs: 1000,
  },
): Promise<T> => {
  let aborted = false;
  options.signal?.addEventListener('abort', () => (aborted = true));
  try {
    return await fn(options.signal);
  } catch (error) {
    if (options.maxRetries > 0 && !aborted) {
      return new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              retry(fn, {
                maxRetries: options.maxRetries - 1,
                delayMs: options.delayMs,
                signal: options.signal,
              }),
            ),
          options.delayMs,
        ),
      );
    }
    throw error;
  }
};

/** Keep trying a method until it does not throw an error */
export const poll = async <T>(
  fn: (signal?: AbortSignal) => Promise<T>,
  options: {
    timeoutSeconds: number;
    delayMs: number;
    signal?: AbortSignal;
  } = {
    timeoutSeconds: 120,
    delayMs: 1000,
  },
): Promise<T> => {
  return retry(fn, {
    maxRetries: (options.timeoutSeconds * 1000) / options.delayMs,
    delayMs: options.delayMs,
    signal: options.signal,
  });
};
