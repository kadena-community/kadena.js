import { ICommand, IUnsignedCommand } from '@kadena/types';

import { ISignFunction } from '../ISignFunction';
import { addSignatures } from '../utils/addSignature';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';

import {
  connect,
  getAccountInfo,
  isConnected,
  isInstalled,
} from './eckoCommon';
import { ICommonEckoFunctions, IEckoQuicksignResponse } from './eckoTypes';

interface IEckoSignFunction extends ISignFunction, ICommonEckoFunctions {}

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

    const response = {
      responses: eckoResponse.quickSignData,
    };

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
  }) as IEckoSignFunction;

  quicksignWithEckoWallet.isInstalled = isInstalled;
  quicksignWithEckoWallet.isConnected = isConnected;
  quicksignWithEckoWallet.connect = connect;
  quicksignWithEckoWallet.getAccountInfo = getAccountInfo;

  return quicksignWithEckoWallet;
}
