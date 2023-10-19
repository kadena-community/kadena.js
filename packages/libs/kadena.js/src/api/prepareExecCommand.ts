import type {
  EnvData,
  ICommand,
  ICommandPayload,
  IKeyPair,
  IMetaData,
  IUnsignedCommand,
  NetworkId,
  Nonce,
  PactCode,
} from '@kadena/types';
import { attachSignature } from './attachSignature';
import { createCommand } from './createCommand';
import { pullSigner } from './pullSigner';

/**
 * Prepare an ExecMsg pact command for use in send or local execution.
 * To use in send, wrap result with 'createSendRequest'.
 * @param keyPairs - array of ED25519 keypair and/or clist (list of capabilities associated with keypairs)
 * @param nonce - nonce value for ensuring unique hash - default to current time
 * @param pactCode - pact code to execute - required
 * @param meta - platform-specific meta information
 * @param networkId - platform-specific network information - not required
 * @param envData - JSON of data in command - not required
 * @return valid pact API command for send or local use.
 */
export function prepareExecCommand(
  keyPairs: Array<IKeyPair>,
  nonce: Nonce,
  pactCode: PactCode,
  meta: IMetaData,
  networkId?: NetworkId,
  envData?: EnvData,
): IUnsignedCommand | ICommand {
  const signers = keyPairs.map(pullSigner);
  const cmdJSON: ICommandPayload = {
    networkId: networkId !== undefined ? networkId : null,
    payload: {
      exec: {
        data: envData !== undefined ? envData : null,
        code: pactCode,
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
