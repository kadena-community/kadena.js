import { createSendRequest } from '@kadena/chainweb-node-client';
import { isSignedCommand } from '@kadena/cryptography-utils';
import type {
  EnvData,
  IKeyPair,
  IMetaData,
  ISendRequestBody,
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

  return createSendRequest([command].filter(isSignedCommand));
}
