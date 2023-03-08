import type {
  CommandPayloadStringifiedJSON,
  ICommand,
  IUnsignedCommand,
  SignatureWithHash,
} from '@kadena/types';

import { pullAndCheckHashs } from './pullAndCheckHashs';

/**
 * Makes a single command given signed data.
 * @param signatures {array} - array of signature objects, see 'sign'
 * @param cmd {string} - stringified JSON blob used to create hash
 * @return valid Pact API command for send or local use.
 */
export function createCommand(
  signatures: Array<SignatureWithHash>,
  cmd: CommandPayloadStringifiedJSON,
): IUnsignedCommand | ICommand {
  return {
    hash: pullAndCheckHashs(signatures),
    sigs: signatures,
    cmd,
  };
}
