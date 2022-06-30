import type {
  EnvData,
  KeyPair,
  MetaData,
  NetworkId,
  Nonce,
  PactTransactionHash,
  Proof,
  Rollback,
  SendRequest,
  Step,
} from '@kadena/types';

import { createSendRequest } from './createSendRequest';
import { prepareContCommand } from './prepareContCommand';

/**
 * Make a full 'send' endpoint cont command. See 'prepareContCommand' for parameters.
 */
export function createContCommand(
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
