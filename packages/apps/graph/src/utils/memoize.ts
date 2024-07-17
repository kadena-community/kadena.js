/**
 * @param fn - function to memoize
 * @param options - options for memoization: maxAge - time in milliseconds to keep the result
 * @returns - memoized function
 */
export function memoize<T>(fn: () => T, options: { maxAge: number }): () => T {
  let lastRun = 0;
  let lastResult: T;

  return () => {
    if (Date.now() - lastRun > options.maxAge) {
      lastResult = fn();
      lastRun = Date.now();
    }

    return lastResult;
  };
}
