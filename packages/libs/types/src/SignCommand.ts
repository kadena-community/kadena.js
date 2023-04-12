/**
 * @alpha
 */
export interface ISignature {
  sig: string | undefined;
}

/**
 * @alpha
 */
export interface ISignedSignatureWithHash extends ISignature {
  hash: string;
  sig: string | undefined;
  pubKey: string;
}

/**
 * @alpha
 */
export interface IUnsignedSignatureWithHash extends ISignature {
  hash: string;
  sig: string | undefined;
  pubKey?: string;
}

/**
 * @alpha
 */
export type SignatureWithHash =
  | ISignedSignatureWithHash
  | IUnsignedSignatureWithHash;

/**
 * @alpha
 */
export type SignCommand = SignatureWithHash;
