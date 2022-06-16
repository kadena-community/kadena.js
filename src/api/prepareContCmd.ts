import { asArray, attachSig, KeyPair, mkSigner } from '../util';
import { mkSingleCmd } from './mkSingleCmd';

/**
 * Prepare an ContMsg pact command for use in send or local execution.
 * To use in send, wrap result with 'mkSingleCommand'.
 * @param keyPairs {array or object} - array or single ED25519 keypair and/or clist (list of `cap` in mkCap)
 * @param nonce {string} - nonce value for ensuring unique hash - default to current time
 * @param step {number} - integer index of step to execute in defpact body - required
 * @param proof {string} - JSON of SPV proof, required for cross-chain transfer. See `fetchSPV` below
 * @param rollback {bool} - Indicates if this continuation is a rollback/cancel- required
 * @param pactId {string} - identifies the already-begun Pact execution that this is continuing - required
 * @param envData {object} - JSON of data in command - not required
 * @param meta {object} - public meta information, see mkMeta
 * @return valid pact API Cont command for send or local use.
 */
export function prepareContCmd(
  keyPairs: [KeyPair],
  nonce: string = new Date().toISOString(),
  proof: string | null,
  pactId: string,
  rollback: boolean,
  step: number,
  envData: object,
  meta = {},
  networkId = null,
) {
  var kpArray = keyPairs;
  var signers = kpArray.map(mkSigner);
  var cmdJSON = {
    networkId: networkId,
    payload: {
      cont: {
        proof: proof || null,
        pactId: pactId,
        rollback: rollback,
        step: step,
        data: envData || {},
      },
    },
    signers: signers,
    meta: meta,
    nonce: JSON.stringify(nonce),
  };
  var cmd = JSON.stringify(cmdJSON);
  var sigs = attachSig(cmd, kpArray);
  return mkSingleCmd(sigs, cmd);
}
