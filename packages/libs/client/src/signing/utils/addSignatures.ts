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
  if (allSignaturesHavePubKeys(signatures)) {
    // signatures have pubKeys, use pubKeys to identify order
    const pubKeyOrder = parsedTransaction.signers.map(
      (signer) => signer.pubKey,
    );
    debug(`Adding signatures based on pubKeys`);

    return {
      cmd,
      hash,
      sigs: pubKeyOrder.map((pubKey, i) => {
        const signature = signatures.find(
          (signature) => signature.pubKey === pubKey,
        );
        // this allows for overriding the signature
        // when a signature is found, the new signature will be used
        if (signature === undefined) {
          // signature not in list of to-be-added signatures
          if (sigs[i] !== undefined) {
            debug(`Using existing signature for pubKey ${pubKey}`);
            // signature already exists, use it
            return sigs[i];
          }
          debug(`No signature for pubKey ${pubKey}`);
          return undefined;
        }
        debug(`Using new signature for pubKey ${pubKey}`);
        return { sig: signature.sig, pubKey };
      }),
    };
  } else if (signaturesMatchesSigners(parsedTransaction, signatures)) {
    // signatures do not have pubKeys, but matching length, use order of signatures
    debug(`Adding signatures based on order of signatures`);
    return {
      cmd,
      hash,
      sigs: signatures.map((signature) => ({ sig: signature.sig })),
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
