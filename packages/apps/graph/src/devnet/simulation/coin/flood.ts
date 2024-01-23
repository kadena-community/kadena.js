import { generateAccount } from '../helper';
import { transfer } from './transfer';

interface IFloodOptions {
  iterationsPerSecond: number;
  iterations: number;
  timeout: number;
}

export async function flood({
  iterationsPerSecond,
  iterations,
  timeout,
}: IFloodOptions) {
  const startTime = Date.now();

  const account = await generateAccount();
  let count = 0;
  let completedTransfers = 0;

  try {
    while (true) {
      if (count >= iterations) {
        break;
      }

      transfer({ receiver: account, amount: 1 }).then((result) => {
        console.log(result.result.status);
        completedTransfers++;
        console.log(`Transfer ${completedTransfers} complete`);
      });
      if (Date.now() - startTime > timeout) {
        break;
      }
      count++;

      console.log(count);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000 / iterationsPerSecond),
      );
    }
  } catch (error) {
    console.error(error);
  }
}
