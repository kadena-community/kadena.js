import {
  type ISendRequestBody,
  createSendRequest,
} from '@kadena/chainweb-node-client';
import { ensureSignedCommand } from '@kadena/pactjs';
import type {
  EnvData,
  IKeyPair,
  IMetaData,
  NetworkId,
  Nonce,
  PactCode,
} from '@kadena/types';

import { prepareExecCommand } from './prepareExecCommand';

/**
 * Make a full 'send' endpoint exec command. See 'prepareExecCommand' for parameters.
 */
export function createExecCommand(
  keyPairs: Array<IKeyPair>,
  nonce: Nonce,
  pactCode: PactCode,
  envData: EnvData,
  meta: IMetaData,
  networkId?: NetworkId,
): ISendRequestBody {
  const command = prepareExecCommand(
    keyPairs,
    nonce,
    pactCode,
    meta,
    networkId,
    envData,
  );
  const signedCommand = ensureSignedCommand(command);
  return createSendRequest(signedCommand);
}
