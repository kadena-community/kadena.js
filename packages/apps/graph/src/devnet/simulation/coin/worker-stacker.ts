let jobStack: Array<Array<Promise<any>>> = [[]];

export const stacker = (transactionStack: Array<Promise<any>>): void => {
  jobStack.push(transactionStack);
};

const pause = (interval: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, interval));
};

export const worker = async (interval: number): Promise<void> => {
  let completedJobs = 0;

  while (true) {
    if (jobStack.length === 0) {
      await pause(interval);
      continue;
    }

    const currentStack = jobStack.shift();
    if (currentStack) {
      for (const job of currentStack) {
        job
          .then((result) => {
            completedJobs++;
            console.log(`Job ${completedJobs} completed successfully`);
          })
          .catch((error) => {
            completedJobs++;
            console.error(
              `Job ${completedJobs} completed with error: ${error}`,
            );
          });
      }
      await pause(interval);
    }
  }
};
