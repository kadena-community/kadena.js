import pullAndCheckHashs from './pullAndCheckHashs';
import pullSignature from './pullSignature';
import { Command, SignatureWithHash } from '../util';
/**
 * Makes a single command given signed data.
 * @param sigs {array} - array of signature objects, see 'sign'
 * @param cmd {string} - stringified JSON blob used to create hash
 * @return valid Pact API command for send or local use.
 */
export default function mkSingleCommand(
  sigs: SignatureWithHash[],
  cmd: string,
): Command {
  return {
    hash: pullAndCheckHashs(sigs),
    sigs: sigs.filter((sig) => sig.sig).map(pullSignature),
    cmd: cmd,
  };
}
