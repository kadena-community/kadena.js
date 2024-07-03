import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { Debugger } from 'debug';
import _debug from 'debug';
import type { IPactCommand } from '../../interfaces/IPactCommand';
import { parseTransactionCommand } from './parseTransactionCommand';

const debug: Debugger = _debug('@kadena/client:signing:addSignature');

/**
 * adds signatures to an {@link @kadena/types#IUnsignedCommand | unsigned command}
 *
 * @public
 */
export const addSignatures: (
  transaction: IUnsignedCommand,
  ...signatures: { sig: string; pubKey?: string }[]
) => IUnsignedCommand | ICommand = (transaction, ...signatures) => {
  debug(`Adding signatures to transaction
  transaction: ${JSON.stringify(transaction)}
  signatures: ${JSON.stringify(signatures)}`);

  const { cmd, hash, sigs } = transaction;
  const parsedTransaction = parseTransactionCommand(transaction);
  const pubKeyOrder = parsedTransaction.signers.map((signer) => signer.pubKey);
  if (allSignaturesHavePubKeys(signatures)) {
    // signatures have pubKeys, use pubKeys to identify order
    debug(`Adding signatures based on pubKeys`);

    return {
      cmd,
      hash,
      sigs: pubKeyOrder.map((pubKey, i) => {
        const existed = sigs.find((sig) => sig?.pubKey === pubKey);
        if (existed && existed.sig) {
          return existed;
        }
        const signature = signatures.find(
          (signature) => signature.pubKey === pubKey,
        );
        return {
          pubKey,
          ...(signature?.sig ? { sig: signature.sig } : {}),
        };
      }),
    };
  } else if (signaturesMatchesSigners(parsedTransaction, signatures)) {
    // signatures do not have pubKeys, but matching length, use order of signatures
    debug(`Adding signatures based on order of signatures`);
    return {
      cmd,
      hash,
      sigs: pubKeyOrder.map((pubKey, i) => ({
        pubKey,
        sig: signatures[i].sig ?? sigs[i]?.sig,
      })),
    };
  } else {
    // signatures do not have pubKeys, and do not match length, ERROR
    const msg = `Signatures do not have pubKeys, and the length of signatures, does not match the length of signers. Cannot add signatures.`;
    debug(msg);
    throw new Error(msg);
  }
};

function signaturesMatchesSigners(
  transaction: IPactCommand,
  sigs: { sig: string; pubKey?: string | undefined }[],
): boolean {
  return transaction.signers.length === sigs.length;
}

function allSignaturesHavePubKeys(
  sigs: { sig: string; pubKey?: string | undefined }[],
): sigs is { sig: string; pubKey: string }[] {
  return sigs.every((sig) => sig.pubKey !== undefined);
}
