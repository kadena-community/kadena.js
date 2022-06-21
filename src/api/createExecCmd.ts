import prepareExecCmd from './prepareExecCmd';
import mkPublicSend from './mkPublicSend';
import { PublicRequest, KeyPair, Command } from '../util';
/**
 * Make a full 'send' endpoint exec command. See 'prepareExecCmd' for parameters.
 */
export default function createExecCmd(
  keyPairs: [KeyPair],
  nonce: string = new Date().toISOString(),
  pactCode: string,
  envData: object,
  meta: object,
  networkId: string | null = null,
): PublicRequest {
  return mkPublicSend([
    prepareExecCmd(keyPairs, nonce, pactCode, envData, meta, networkId),
  ]);
}
