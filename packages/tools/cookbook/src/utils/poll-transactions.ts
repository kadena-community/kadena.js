import { poll } from '@kadena/chainweb-node-client';

// Poll for transaction mined on the blockchain
export async function pollTransactions(
  requestKeys: string[],
  apiHost: string,
): Promise<void> {
  if (requestKeys.length === 0) {
    console.log('function called without arguments');
    return;
  }

  console.log(`Polling for: ${requestKeys.join(',')}`);
  const pollResponse = await poll({ requestKeys }, apiHost);

  if (Object.keys(pollResponse).length === 0) {
    console.log('No transactions found yet');
    setTimeout(() => pollTransactions(requestKeys, apiHost), 5000);
  } else {
    console.log('Found transactions:');
    const foundRequestKeys: string[] = [];
    Object.keys(pollResponse).forEach((requestKey) => {
      console.log(
        `Request key: ${requestKey}\nPoll response:\n`,
        JSON.stringify(pollResponse[requestKey], undefined, 2),
      );
      foundRequestKeys.push(requestKey);
    });

    const remainingTransactions = requestKeys.filter(
      (k) => !foundRequestKeys.includes(k),
    );

    remainingTransactions.length
      ? setTimeout(() => pollTransactions(remainingTransactions, apiHost), 5000)
      : console.log('Polling Completed');
  }
}
