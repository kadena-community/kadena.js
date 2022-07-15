import nacl from 'tweetnacl';

/**
 * Verifies the signature for the message and returns true if verification succeeded or false if it failed.
 *
 * @alpha
 */
export function verifySig(
  msg: Uint8Array,
  sig: Uint8Array,
  pubKey: Uint8Array,
): boolean {
  return nacl.sign.detached.verify(msg, sig, pubKey);
}
