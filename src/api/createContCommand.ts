import prepareContCommand from './prepareContCommand';
import createSendRequest from './createSendRequest';
import {
  Base64Url,
  ChainwebMetaData,
  ChainwebNonce,
  ChainwebEnvData,
  ChainwebNetworkId,
  ChainwebContStep,
  ChainwebContRollback,
  SendRequest,
  KeyPair,
  Command,
} from '../util';

/**
 * Make a full 'send' endpoint cont command. See 'prepareContCommand' for parameters.
 */
export default function createContCommmand(
  keyPairs: Array<KeyPair>,
  nonce: ChainwebNonce,
  step: ChainwebContStep,
  pactId: Base64Url,
  rollback: ChainwebContRollback,
  envData: ChainwebEnvData,
  meta: ChainwebMetaData,
  proof: string | null,
  networkId: ChainwebNetworkId,
): SendRequest {
  return createSendRequest([
    prepareContCommand(
      keyPairs,
      nonce,
      proof,
      pactId,
      rollback,
      step,
      envData,
      meta,
      networkId,
    ),
  ]);
}
