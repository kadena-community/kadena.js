import type { ICoinCaps, ICommandBuilder, IPactCommand } from '@kadena/client';

/**
 * The output of the following code can be pasted as SigData in the
 * Chainweaver SigBuilder to manually sign the transaction:
 *
 * @export
 * @param {(ICommandBuilder<ICoinCaps> & IPactCommand)} transactionBuilder
 * @return {Promise<void>}
 */
export async function printSigData(
  transactionBuilder: ICommandBuilder<ICoinCaps> & IPactCommand,
): Promise<void> {
  const unsignedTransaction = await transactionBuilder.createCommand();
  console.log(
    `Paste the following as SigData in the Chainweaver SigBuilder:\n${JSON.stringify(
      unsignedTransaction.cmd,
    )}`,
  );
}
