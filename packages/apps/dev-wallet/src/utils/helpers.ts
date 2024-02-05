export const execInSequence = <Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
) => {
  let taskChain: Promise<T | void> = Promise.resolve();
  return (...args: Args) => {
    taskChain = taskChain.catch(() => undefined).then(() => fn(...args));
    return taskChain as Promise<T>;
  };
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
