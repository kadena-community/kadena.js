import { signHash } from '@kadena/cryptography-utils';
import type { IKeyPair, IUnsignedCommand } from '@kadena/types';
import type { Debugger } from 'debug';
import _debug from 'debug';
import type { IPactCommand } from '../../interfaces/IPactCommand';
import type { ISignFunction } from '../ISignFunction';
import { addSignatures } from '../utils/addSignatures';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';

const debug: Debugger = _debug('pactjs:signWithKeypair');

/**
 * interface for the `createSignWithKeypair` function {@link createSignWithKeypair}
 *
 * @public
 */
export interface ICreateSignWithKeypair {
  /**
   * @param key - provide the key to sign with
   * @returns a function to sign with
   *
   * @example
   * ```ts
   * const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
   * const [signedTx1, signedTx2] = await signWithKeystore([tx1, tx2]);
   * const signedTx3 = await signWithKeystore(tx3);
   * ```
   *
   * @public
   */
  (key: IKeyPair): ISignFunction;
  /**
   * @param keys - provide the keys to sign with
   * @returns a function to sign with
   *
   *
   * @example
   * ```ts
   * const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
   * const [signedTx1, signedTx2] = await signWithKeystore([tx1, tx2]);
   * const signedTx3 = await signWithKeystore(tx3);
   * ```
   *
   * @public
   */
  (keys: IKeyPair[]): ISignFunction;
}

/**
 * function to create a `signWithKeypair` function
 * This allows you to sign subsequent transactions with the same keypair(s)
 *
 * @param keyOrKeys - provide the key or multiple keys to sign with
 * @returns a function to sign with
 *
 * @example
 * ```ts
 * const signWithKeystore = createSignWithKeypair([keyPair, keyPair2]);
 * const [signedTx1, signedTx2] = await signWithKeystore([tx1, tx2]);
 * const signedTx3 = await signWithKeystore(tx3);
 * ```
 *
 * @public
 */
export const createSignWithKeypair: ICreateSignWithKeypair = (keyOrKeys) => {
  const keypairs: IKeyPair[] = Array.isArray(keyOrKeys)
    ? keyOrKeys
    : [keyOrKeys];
  return async function signWithKeypair(transactionList) {
    if (transactionList === undefined) {
      throw new Error('No transaction(s) to sign');
    }

    const isList = Array.isArray(transactionList);
    const transactions = isList ? transactionList : [transactionList];

    const signedTransactions = transactions.map((tx) => {
      debug(`signing transaction(s): ${JSON.stringify(tx)}`);
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
  } as ISignFunction;
};

function getRelevantKeypairs(
  tx: IPactCommand,
  keypairs: IKeyPair[],
): IKeyPair[] {
  const relevantKeypairs = keypairs.filter((keypair) =>
    tx.signers.some(({ pubKey }) => pubKey === keypair.publicKey),
  );
  debug('relevant keypairs', relevantKeypairs);
  return relevantKeypairs;
}

function signWithKeypairs(
  tx: IUnsignedCommand,
  relevantKeypairs: IKeyPair[],
): IUnsignedCommand {
  return relevantKeypairs.reduce((tx, keypair) => {
    const { sig, pubKey } = signHash(tx.hash, keypair);
    if (sig === undefined || pubKey === undefined) {
      return tx;
    }

    debug(`adding signature from keypair: pubkey: ${keypair.publicKey}`);
    return addSignatures(tx, { sig: sig, pubKey: pubKey });
  }, tx);
}
