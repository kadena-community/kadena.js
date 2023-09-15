import { signHash } from '@kadena/cryptography-utils';
import type { IUnsignedCommand } from '@kadena/types';

import type { IPactCommand } from '../../interfaces/IPactCommand';
import type { ISignFunction, ISingleSignFunction } from '../ISignFunction';
import { addSignatures } from '../utils/addSignatures';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';

import type { Debugger } from 'debug';
import _debug from 'debug';

const debug: Debugger = _debug('pactjs:signWithKeypair');

export interface IKeypair {
  publicKey: string;
  secretKey: string;
}

/**
 * Sign with public/private key-pair according to {@link https://github.com/kadena-io/KIPs/blob/master/kip-0015.md | sign-v1 API}
 *
 * @public
 */
export const createSignWithKeypair: (
  keyOrKeys: IKeypair | IKeypair[],
) => ISignFunction & ISingleSignFunction = (
  keyOrKeys,
): ISignFunction & ISingleSignFunction => {
  const keypairs: IKeypair[] = Array.isArray(keyOrKeys)
    ? keyOrKeys
    : [keyOrKeys];
  return (async (transactionList) => {
    if (transactionList === undefined) {
      throw new Error('No transaction(s) to sign');
    }

    const isList = Array.isArray(transactionList);
    const transactions = isList ? transactionList : [transactionList];

    const signedTransactions = transactions.map((tx) => {
      const parsedTransaction = parseTransactionCommand(tx);
      const relevantKeypairs = getRelevantKeypairs(parsedTransaction, keypairs);

      if (relevantKeypairs.length === 0) {
        throw new Error(
          'The keypair(s) provided are not relevant to the transaction',
        );
      }

      return signWithKeypairs(tx, relevantKeypairs);
    });

    return isList ? signedTransactions : signedTransactions[0];
  }) as ISignFunction & ISingleSignFunction;
};

function getRelevantKeypairs(
  tx: IPactCommand,
  keypairs: IKeypair[],
): IKeypair[] {
  const relevantKeypairs = keypairs.filter((keypair) =>
    tx.signers.some(({ pubKey }) => pubKey === keypair.publicKey),
  );
  debug('relevant keypairs', relevantKeypairs);
  return relevantKeypairs;
}

function signWithKeypairs(
  tx: IUnsignedCommand,
  relevantKeypairs: IKeypair[],
): IUnsignedCommand {
  return relevantKeypairs.reduce((tx, keypair) => {
    const { sig, pubKey } = signHash(tx.hash, keypair);

    debug(`adding signature from keypair: pubkey: ${keypair.publicKey}`);
    return addSignatures(tx, { sig: sig!, pubKey });
  }, tx);
}
