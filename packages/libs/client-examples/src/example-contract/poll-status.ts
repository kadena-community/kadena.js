import { pollStatus } from './util/client';

export async function pollRequestsAndWaitForEachPromiseExample(): Promise<void> {
  const someRequestKeys = ['key1', 'key2'];
  // you can await for this promise, but you even can await for the result of each individual request
  const results = pollStatus(someRequestKeys, {
    networkId: 'testnet04',
    chainId: '1',
    onPoll: (requestKey) => {
      console.log('polling status of', requestKey);
    },
  });

  // await for each individual request
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
  );
}
