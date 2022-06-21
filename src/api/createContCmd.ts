import prepareContCmd from './prepareContCmd';
import mkPublicSend from './mkPublicSend';
import { PublicRequest, KeyPair, Command } from '../util';

/**
 * Make a full 'send' endpoint cont command. See 'prepareContCmd' for parameters.
 */
export default function createContCmd(
  keyPairs: [KeyPair],
  nonce: string = new Date().toISOString(),
  step: number,
  pactId: string,
  rollback: boolean,
  envData: object,
  meta = {},
  proof: string | null,
  networkId = null,
): PublicRequest {
  return mkPublicSend([
    prepareContCmd(
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
