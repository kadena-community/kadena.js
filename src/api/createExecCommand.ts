import prepareExecCommand from './prepareExecCommand';
import createSendRequest from './createSendRequest';
import {
  NetworkId,
  MetaData,
  EnvData,
  Nonce,
  PactCode,
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
