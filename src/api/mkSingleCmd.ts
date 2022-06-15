import {
  pullAndCheckHashs,
  pullSig,
  PreparedCommand,
  SignCommand,
} from '../util';
/**
 * Makes a single command given signed data.
 * @param sigs {array} - array of signature objects, see 'sign'
 * @param cmd {string} - stringified JSON blob used to create hash
 * @return valid Pact API command for send or local use.
 */
export function mkSingleCmd(sigs: SignCommand[], cmd: string): PreparedCommand {
  return {
    hash: pullAndCheckHashs(sigs),
    sigs: sigs.filter((sig) => sig.sig).map(pullSig),
    cmd: cmd,
  };
}
