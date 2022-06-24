import prepareExecCommand from './prepareExecCommand';
import createSendRequest from './createSendRequest';
import {
  ChainwebNetworkId,
  ChainwebMetaData,
  Base64Url,
  SendRequest,
  KeyPair,
  Command,
} from '../util';
/**
 * Make a full 'send' endpoint exec command. See 'prepareExecCommand' for parameters.
 */
export default function createExecCommmand(
  keyPairs: Array<KeyPair>,
  nonce: string = new Date().toISOString(),
  pactCode: string,
  envData: object,
  meta: ChainwebMetaData,
  networkId: ChainwebNetworkId,
): SendRequest {
  return createSendRequest([
    prepareExecCommand(keyPairs, nonce, pactCode, envData, meta, networkId),
  ]);
}
