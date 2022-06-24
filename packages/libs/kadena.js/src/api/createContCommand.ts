import prepareContCommand from './prepareContCommand';
import createSendRequest from './createSendRequest';
import {
  Base64Url,
  MetaData,
  Nonce,
  Proof,
  EnvData,
  NetworkId,
  Step,
  Rollback,
  PactTransactionHash,
  SendRequest,
  KeyPair,
  Command,
} from '../util';

/**
 * Make a full 'send' endpoint cont command. See 'prepareContCommand' for parameters.
 */
export default function createContCommmand(
  keyPairs: Array<KeyPair>,
  nonce: Nonce,
  step: Step,
  pactId: PactTransactionHash,
  rollback: Rollback,
  envData: EnvData,
  meta: MetaData,
  proof: Proof,
  networkId: NetworkId,
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
