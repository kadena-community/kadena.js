import { hash as blakeHash } from '@kadena/cryptography-utils';
import { ICommandPayload } from '@kadena/types';

import { IUnsignedTransaction } from './interfaces/IUnsignedTransaction';
import { buildCommandFromTemplate } from './buildCommandFromTemplate';

import debug from 'debug';
import { parse } from 'yaml';

/**
 * @alpha
 */
export function buildUnsignedTransaction(
  parts: string[],
  holes: string[],
  args: Record<string, string>,
): IUnsignedTransaction {
  const cmd: string = buildCommandFromTemplate(parts, holes, args);

  const hash = blakeHash(cmd);
  let unsignedTransactionCommand: ICommandPayload | undefined;
  try {
    unsignedTransactionCommand = parse(cmd) as ICommandPayload;
  } catch (e) {
    throw new Error(`An error occurred when parsing the filled template.
! Please check your template and make sure there aren't any syntax errors.
The values:
  ${JSON.stringify(args)}

Error: ${e}`);
  }
  debug('pactjs:buildUnsignedTransaction')('cmd', cmd);
  debug('pactjs:buildUnsignedTransaction')(
    'unsignedTransactionCommand',
    unsignedTransactionCommand,
  );

  return {
    cmd: JSON.stringify(unsignedTransactionCommand),
    hash,
    sigs: unsignedTransactionCommand.signers.reduce((acc, signer) => {
      acc[signer.pubKey] = null;
      return acc;
    }, {} as Record<string, null>),
    // sigs: unsignedTransactionCommand.signers.reduce((acc, signer) => {
    //   acc.push({ hash, sig: undefined, pubKey: signer.pubKey });
    //   return acc;
    // }, [] as SignCommand[]),
  };
}
