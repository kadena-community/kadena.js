// Returns the public key for the provided account name assuming
// the naming follows the recommended convention: "k:publicKey"
export function getAccountKey(account: string): string {
  return account.split(':')[1];
}

// The output of the following code can be pasted as SigData in the
// Chainweaver SigBuilder to manually sign the transaction:
export async function printSigData(transactionBuilder: any) {
  const unsignedTransaction = await transactionBuilder.createCommand();
  console.log(
    `Paste the following as SigData in the Chainweaver SigBuilder:\n${JSON.stringify(
      unsignedTransaction.cmd,
    )}`,
  );
}

export async function printLocal(signedTransactions: any[], apiHost: string) {
  //   const localRequests = signedTransactions.map((tx) => {
  //     console.log(`Sending transaction: ${tx.code}`);
  //     return tx.local(apiHost);
  //   });
  //   const localReponses = await Promise.all(localRequests);
  //   localReponses.map(async (response) => {
  //     console.log(response);
  //   });
}

export function apiHost(
  chainId: string = '1',
  network: string = 'testnet.',
  networkId: string = 'testnet04',
  apiVersion: string = '0.0',
): string {
  return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
}
