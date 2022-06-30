import type {
  EnvData,
  KeyPair,
  MetaData,
  NetworkId,
  Nonce,
  PactCode,
  SendRequest,
} from '@kadena/types';

import { createSendRequest } from './createSendRequest';
import { prepareExecCommand } from './prepareExecCommand';
/**
 * Make a full 'send' endpoint exec command. See 'prepareExecCommand' for parameters.
 */
export function createExecCommand(
  keyPairs: Array<KeyPair>,
  nonce: Nonce,
  pactCode: PactCode,
  envData: EnvData,
  meta: MetaData,
  networkId: NetworkId,
): SendRequest {
  return createSendRequest([
    prepareExecCommand(keyPairs, nonce, pactCode, envData, meta, networkId),
  ]);
}
