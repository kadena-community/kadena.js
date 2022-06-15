import { asArray, attachSig, KeyPair } from '../util';
import mkSingleCmd from './mkSingleCmd';

/**
 * Prepare an ExecMsg pact command for use in send or local execution.
 * To use in send, wrap result with 'mkSingleCommand'.
 * @param keyPairs {array or object} - array or single ED25519 keypair and/or clist (list of `cap` in mkCap)
 * @param nonce {string} - nonce value for ensuring unique hash - default to current time
 * @param pactCode {string} - pact code to execute - required
 * @param envData {object} - JSON of data in command - not required
 * @param meta {object} - public meta information, see mkMeta
 * @return valid pact API command for send or local use.
 */
export function prepareExecCmd(
  keyPairs: KeyPair[] | KeyPair = [],

  //{publicKey , secretKey}
  //[{publicKey, secretKey}, ... ]
  //{publicKey}
  nonce: string = new Date().toISOString(),
  pactCode: string,
  envData: object,
  meta: object = mkMeta('', '', 0, 0, 0, 0),
  networkId: string | null = null,
) {
  var kpArray = asArray(keyPairs);
  var signers = kpArray.map(mkSigner);
  var cmdJSON = {
    networkId: networkId,
    payload: {
      exec: {
        data: envData || {},
        code: pactCode,
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
