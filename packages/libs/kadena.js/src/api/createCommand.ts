import pullAndCheckHashs from './pullAndCheckHashs';
import pullSignature from './pullSignature';
import {
  Command,
  SignatureWithHash,
  CommandPayloadStringifiedJSON,
} from '../util';
/**
 * Makes a single command given signed data.
 * @param signatures {array} - array of signature objects, see 'sign'
 * @param cmd {string} - stringified JSON blob used to create hash
 * @return valid Pact API command for send or local use.
 */
export default function createCommand(
  signatures: Array<SignatureWithHash>,
  cmd: CommandPayloadStringifiedJSON,
): Command {
  return {
    hash: pullAndCheckHashs(signatures),
    sigs: signatures.filter(({ sig }) => sig).map(pullSignature),
    cmd,
  };
}
