import { ICommandResult } from '@kadena/chainweb-node-client';

let workerStack: Array<Array<Promise<ICommandResult>>> = [[]];

export const stacker = async (
  transactionStack: Array<Promise<ICommandResult>>,
) => {
  workerStack.push(transactionStack);
};

export const worker = async (interval: number) => {
  let completedActions = 0;
  let iterationCount = 0;

  while (true) {
    const currentStack = workerStack.shift();
    iterationCount++;

    if (!currentStack) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      continue;
    }

    for (const transaction of currentStack) {
      transaction.then((result) => {
        completedActions++;
        console.log(
          `Action ${completedActions} completed on iteration ${iterationCount} with status ${result.result.status}`,
        );
      });
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
};
