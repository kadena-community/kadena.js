import attachSignature from './attachSignature';
import pullSigner from './pullSigner';
import createCommand from './createCommand';
import {
  KeyPair,
  PactTransactionHash,
  Nonce,
  NetworkId,
  Proof,
  MetaData,
  EnvData,
  Step,
  Rollback,
  Command,
  CommandPayload,
  Base64Url,
  Base16String,
} from '../util';
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
export default function prepareContCommand(
  keyPairs: Array<KeyPair>,
  nonce: Nonce,
  proof: Proof,
  pactId: PactTransactionHash,
  rollback: Rollback,
  step: Step,
  envData: EnvData,
  meta: MetaData,
  networkId: NetworkId,
): Command {
  const signers = keyPairs.map(pullSigner);

  const cmdJSON: CommandPayload = {
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
  const cmd = JSON.stringify(cmdJSON);
  const sigs = attachSignature(cmd, keyPairs);
  return createCommand(sigs, cmd);
}
