import type { ICommand, IUnsignedCommand } from '@kadena/types';

import { addSignatures } from '../utils/addSignatures';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';

import { connect, isConnected, isInstalled } from './eckoCommon';
import type { IEckoQuicksignResponse, IEckoSignFunction } from './eckoTypes';

/**
 * Creates the quicksignWithWalletConnect function with interface {@link ISingleSignFunction}
 *
 * @public
 */
export function createEckoWalletQuicksign(): IEckoSignFunction {
  const quicksignWithEckoWallet: IEckoSignFunction = (async (
    transactionList: IUnsignedCommand | Array<IUnsignedCommand | ICommand>,
  ) => {
    if (transactionList === undefined) {
      throw new Error('No transaction(s) to sign');
    }
    const isList = Array.isArray(transactionList);
    const transactions = isList ? transactionList : [transactionList];

    const transactionHashes: string[] = [];

    const { networkId } = parseTransactionCommand(transactions[0]);

    const commandSigDatas = transactions.map((pactCommand) => {
      const { cmd, hash } = pactCommand;
      const parsedTransaction = parseTransactionCommand(pactCommand);
      transactionHashes.push(hash);

      if (networkId !== parsedTransaction.networkId) {
        throw new Error('Network is not equal for all transactions');
      }

      return {
        cmd,
        sigs: parsedTransaction.signers.map((signer, i) => ({
          pubKey: signer.pubKey,
          sig: pactCommand.sigs[i]?.sig ?? null,
        })),
      };
    });

    const eckoResponse = await window.kadena?.request<IEckoQuicksignResponse>({
      method: 'kda_requestQuickSign',
      data: {
        networkId,
        commandSigDatas,
      },
    });

    if (!eckoResponse || eckoResponse?.status === 'fail') {
      throw new Error('Error signing transaction');
    }

    if ('quickSignData' in eckoResponse) {
      eckoResponse.quickSignData.map((signedCommand, i) => {
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
  }) as IEckoSignFunction;

  quicksignWithEckoWallet.isInstalled = isInstalled;
  quicksignWithEckoWallet.isConnected = isConnected;
  quicksignWithEckoWallet.connect = connect;

  return quicksignWithEckoWallet;
}
