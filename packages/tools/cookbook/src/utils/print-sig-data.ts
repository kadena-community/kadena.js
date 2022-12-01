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
