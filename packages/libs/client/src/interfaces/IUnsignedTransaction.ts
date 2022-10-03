type PublicKey = string;

/**
 * @alpha
 */
export interface IUnsignedTransaction {
  hash: string;
  // eslint-disable-next-line @rushstack/no-new-null
  sigs: Record<PublicKey, null>;
  cmd: string;
}
