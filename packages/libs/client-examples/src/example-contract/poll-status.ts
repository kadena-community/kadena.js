import type { ChainId } from '@kadena/types';
import { pollStatus } from './util/client';

export async function pollRequestsAndWaitForEachPromiseExample(): Promise<void> {
  const someRequestKeys = ['key1', 'key2'];
  const transactionDescriptors = someRequestKeys.map((requestKey) => ({
    requestKey,
    networkId: 'testnet04',
    chainId: '1' as ChainId,
  }));
  // You can await this promise, but you can also await the result of each individual request
  const results = pollStatus(transactionDescriptors, {
    onPoll: (requestKey) => {
      console.log('polling status of', requestKey);
    },
  });

  // await for each individual request
  await Promise.all(
    Object.entries(results.requests).map(([requestKey, promise]) =>
      promise
        .then((data) => {
          console.log('the request ', requestKey, 'result:', data);
        })
        .catch((error) => {
          console.log(
            'error while getting the status of ',
            requestKey,
            'error:',
            error,
          );
        }),
    ),
  );
}
