import { generateAccount } from '../helper';
import { transfer } from './transfer';

interface IFloodOptions {
  iterations: number;
  timeout: number;
}

export async function flood({ iterations, timeout }: IFloodOptions) {
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

      // if (count % 200 === 0)
      //   await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error(error);
  }
}
