import { Meta } from '../util';
/**
 * Prepare a chainweb-style public meta payload.
 */
export default function mkMeta(
  sender: string,
  chainId: string,
  gasPrice: number,
  gasLimit: number,
  creationTime: number,
  ttl: number,
): Meta {
  return {
    sender,
    chainId,
    gasPrice,
    gasLimit,
    creationTime,
    ttl,
  };
}
