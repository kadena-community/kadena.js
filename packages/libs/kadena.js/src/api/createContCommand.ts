import type {
  EnvData,
  IKeyPair,
  IMetaData,
  ISendRequestBody,
  NetworkId,
  Nonce,
  PactTransactionHash,
  Proof,
  Rollback,
  Step,
} from '@kadena/types';

import { createSendRequest } from './createSendRequest';
import { isFullySigned } from './isFullySigned';
import { prepareContCommand } from './prepareContCommand';

/**
 * Make a full 'send' endpoint cont command. See 'prepareContCommand' for parameters.
 */
export function createContCommand(
  keyPairs: Array<IKeyPair>,
  nonce: Nonce,
  step: Step,
  pactId: PactTransactionHash,
  rollback: Rollback,
  envData: EnvData,
  meta: IMetaData,
  proof: Proof,
  networkId: NetworkId,
): ISendRequestBody {
  const command = isFullySigned(
    prepareContCommand(
      keyPairs,
      nonce,
      proof,
      pactId,
      rollback,
      step,
      meta,
      networkId,
      envData,
    ),
  );
  return createSendRequest([command]);
}
