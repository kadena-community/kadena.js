import type { ISendRequestBody } from '@kadena/chainweb-node-client';
import { createSendRequest } from '@kadena/chainweb-node-client';
import { ensureSignedCommand } from '@kadena/pactjs';
import type {
  EnvData,
  IKeyPair,
  IMetaData,
  NetworkId,
  Nonce,
  PactTransactionHash,
  Proof,
  Rollback,
  Step,
} from '@kadena/types';
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
  const command = prepareContCommand(
    keyPairs,
    nonce,
    proof,
    pactId,
    rollback,
    step,
    meta,
    networkId,
    envData,
  );
  const signedCommand = ensureSignedCommand(command);
  return createSendRequest(signedCommand);
}
