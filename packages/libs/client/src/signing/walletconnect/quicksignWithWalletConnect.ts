import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type Client from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import type { IQuicksignResponse } from '../../signing-api/v1/quicksign';
import type { ISignFunction } from '../ISignFunction';
import { addSignatures } from '../utils/addSignatures';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';

/**
 * Creates the quicksignWithWalletConnect function with interface {@link ISingleSignFunction}
 *
 * @public
 */
export function createWalletConnectQuicksign(
  client: Client,
  session: SessionTypes.Struct,
  networkId: string,
): ISignFunction {
  const walletConnectChainId = networkId.startsWith('kadena:')
    ? networkId
    : `kadena:${networkId}`;
  const quicksignWithWalletConnect: ISignFunction = (async (
    transactionList: IUnsignedCommand | Array<IUnsignedCommand | ICommand>,
  ) => {
    if (transactionList === undefined) {
      throw new Error('No transaction(s) to sign');
    }
    const isList = Array.isArray(transactionList);
    const transactions = isList ? transactionList : [transactionList];

    const transactionHashes: string[] = [];

    const commandSigDatas = transactions.map((pactCommand) => {
      const { cmd, hash } = pactCommand;
      const { signers } = parseTransactionCommand(pactCommand);
      transactionHashes.push(hash);

      return {
        cmd,
        sigs: signers.map((signer, i) => ({
          pubKey: signer.pubKey,
          sig: pactCommand.sigs[i]?.sig ?? null,
        })),
      };
    });

    const quickSignRequest = {
      commandSigDatas,
    };

    const transactionRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: 'kadena_quicksign_v1',
      params: quickSignRequest,
    };

    const response = await client.request<IQuicksignResponse>({
      topic: session.topic,
      chainId: walletConnectChainId,
      request: transactionRequest,
    });

    if (response === undefined) {
      throw new Error('Error signing transaction');
    }

    if ('responses' in response) {
      response.responses.map((signedCommand, i) => {
        if (signedCommand.outcome.result === 'success') {
          if (signedCommand.outcome.hash !== transactionHashes[i]) {
            throw new Error(
              `Hash of the transaction signed by the wallet does not match. Our hash: ${transactionHashes[i]}, wallet hash: ${signedCommand.outcome.hash}`,
            );
          }

          const sigs = signedCommand.commandSigData.sigs.filter(
            (sig) => sig.sig !== null,
          ) as { pubKey: string; sig: string }[];

          // Add the signature(s) that we received from the wallet to the PactCommand(s)
          transactions[i] = addSignatures(transactions[i], ...sigs);
        }
      });
    } else {
      throw new Error('Error signing transaction');
    }

    return isList ? transactions : transactions[0];
  }) as ISignFunction;

  return quicksignWithWalletConnect;
}
