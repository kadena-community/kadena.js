import type {
  EnvData,
  ICommand,
  ICommandPayload,
  IKeyPair,
  IMetaData,
  IUnsignedCommand,
  NetworkId,
  Nonce,
  PactTransactionHash,
  Proof,
  Rollback,
  Step,
} from '@kadena/types';
import { attachSignature } from './attachSignature';
import { createCommand } from './createCommand';
import { pullSigner } from './pullSigner';
/**
 * Prepare an ContMsg pact command for use in send or local execution.
 * To use in send, wrap result with 'createSendRequest'.
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
export function prepareContCommand(
  keyPairs: Array<IKeyPair>,
  nonce: Nonce,
  proof: Proof,
  pactId: PactTransactionHash,
  rollback: Rollback,
  step: Step,
  meta: IMetaData,
  networkId?: NetworkId,
  envData?: EnvData,
): IUnsignedCommand | ICommand {
  const signers = keyPairs.map(pullSigner);

  const cmdJSON: ICommandPayload = {
    networkId: networkId !== undefined ? networkId : null,
    payload: {
      cont: {
        proof: proof !== undefined ? proof : null,
        pactId,
        rollback,
        step,
        data: envData !== undefined ? envData : null,
      },
    },
    signers,
    meta,
    nonce: JSON.stringify(nonce),
  };
  const cmd = JSON.stringify(cmdJSON);
  const sigs = attachSignature(cmd, keyPairs);
  return createCommand(sigs, cmd);
}
