import type { ICoinCaps, ICommandBuilder, IPactCommand } from '@kadena/client';

// Blocking/sync call to submit a command for non-transactional execution
// In a blockchain environment this would be a node-local “dirty read”
export async function printTransactionsLocal(
  signedTransactions: (ICommandBuilder<ICoinCaps> & IPactCommand)[],
  apiHost: string,
): Promise<void> {
  const localRequests = signedTransactions.map((tx) => {
    console.log(`Sending transaction: ${tx.code}`);
    return tx.local(apiHost);
  });
  const localReponses = await Promise.all(localRequests);
  localReponses.map(async (response) => {
    console.log(response);
  });
}
