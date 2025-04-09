import type { ICommandResult } from '@kadena/client';
import { createClient, isSignedTransaction, Pact } from '@kadena/client';

interface ITransfer {
  accountFrom: string;
  pubkey: string;
  accountTo: string;
  amount: number;
  client: any;
}

export const createTransferCmd = async ({
  accountFrom,
  pubkey,
  accountTo,
  amount,
  client,
}: ITransfer): Promise<ICommandResult> => {
  try {
    const transactionBuilder = Pact.builder
      .execution(
        (Pact as any).modules['coin']['transfer'](accountFrom, accountTo, {
          decimal: amount.toString(),
        }),
      )
      .addSigner(
        {
          pubKey: pubkey,
          scheme: 'ED25519',
        },
        (withCapability: any) => [
          withCapability('coin.GAS'),
          withCapability('coin.TRANSFER', accountFrom, accountTo, {
            decimal: amount.toString(),
          }),
        ],
      )
      .setMeta({ chainId: '0', senderAccount: accountFrom })
      .setNetworkId('mainnet01')
      .getCommand();

    console.log('tx', transactionBuilder);

    const signedTx = await client.signCommand(
      'Chainweaver',
      transactionBuilder,
    );
    const kadenaClient = createClient(
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/pact',
    );

    if (isSignedTransaction(signedTx)) {
      const transactionDescriptor = await kadenaClient.submit(signedTx);
      const response = await kadenaClient.listen(transactionDescriptor);

      if (response.result.status === 'success') {
        return response;
      } else {
        throw new Error(`Transaction failed: ${response.result.error}`);
      }
    } else {
      throw new Error('Failed to sign transaction.');
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Transaction Error: ${e.message}`);
    } else {
      throw new Error('An unknown error occurred during the transaction.');
    }
  }
};
