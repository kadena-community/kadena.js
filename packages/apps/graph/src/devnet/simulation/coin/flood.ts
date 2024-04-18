import type { ChainId, ICommandResult } from '@kadena/client';
import { generateAccount } from '../helper';
import { transfer } from './transfer';
import { stacker, worker } from './worker-stacker';

export const flood = async (
  txPerIteration: number,
  timeoutBetweenIteration: number,
  finishAfterTx: number,
): Promise<void> => {
  const account = await generateAccount();
  let newStack: Promise<ICommandResult>[] = [];

  worker(timeoutBetweenIteration).catch((error) => {
    console.error('Worker failed:', error);
  });

  let count = 0;
  let totalTx = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let i = 0; i < 19; i++) {
      if (totalTx >= finishAfterTx) {
        stacker(newStack);
        console.log('All transactions sent. Exiting.');
        return;
      }

      newStack.push(
        transfer({
          receiver: account,
          amount: 1,
          chainId: i.toString() as ChainId,
        }),
      );
      count++;
      totalTx++;

      // After x loops, timeout for half iteration interval
      if (count === txPerIteration) {
        stacker(newStack);
        newStack = [];
        count = 0;
        await new Promise((resolve) =>
          setTimeout(resolve, timeoutBetweenIteration / 2),
        );
      }
    }
  }
};
